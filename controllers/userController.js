import { UserModel } from "../schema/user.js"
import { hash_password } from "../utils/passwd.js"
import { dbClose, dbConnect } from "../database/dbConnect.js";
import { InstructorModel } from "../schema/instructor.js";


export const get_users = async (req, res) => {
    try {
        await dbConnect()
        const users = await UserModel.find({}, "_id first_name last_name email userType");
        res.status(200).json(users)
    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose()
    }

}


export const get_a_user = async (req, res) => {
    try {
        await dbConnect()
        const user = await UserModel.findById(req.params.id, "last_name first_name id email date_created date_updated");
        res.status(200).json(user)
    }
    catch (err) {
        res.status(400).json(err.message)
    } finally {
        dbClose()
    }
}


export const create_user = async (req, res) => {
    const { first_name, last_name, email, userType, bio } = req.body
    const hashedpw = await req.hash_password
    const user = new UserModel(
        {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedpw,
            userType: userType
        }
    )
    try {
        if(userType == "instructor"){
            await dbConnect()
            const savedUser = await user.save()
            const instructor = new InstructorModel(
                {
                    name: `${savedUser.last_name} ${savedUser.first_name}`,
                    bio: bio,
                    userId: savedUser._id
                }
            )
            const Instructor_info = await instructor.save()
            const { first_name, last_name, _id, email, createdAt, updatedAt} = savedUser
            res.status(200).json({ first_name, last_name, _id, email, createdAt, updatedAt, Instructor_info})
        }
        await dbConnect()
        const savedUser = await user.save()
        const { first_name, last_name, _id, email, createdAt, updatedAt} = savedUser
        res.status(200).json({ first_name, last_name, _id, email, createdAt, updatedAt })
    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        dbClose()
    }

}


export const update_user = async (req, res) => {
    const { last_name, first_name } = req.body
    try {
        const update = {};
        if (last_name) update.last_name = last_name;
        if (first_name) update.first_name = first_name;
        if (Object.keys(update).length === 0) {
            res.status(400).send("last_name or first_name required");
        }
        else {
            await dbConnect()
            const user = await UserModel.findByIdAndUpdate(req.params.id, update, { new: true })
            if (!user) {
                return res.status(404).send("User not found");
            }
            const { id, last_name, first_name, email } = user
            const updated_user = { id, last_name, first_name, email };
            res.status(200).json(updated_user)
        }

    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose()
    }
}


export const delete_user = (req, res) => {
    res.status(200).send("delete a user")
}