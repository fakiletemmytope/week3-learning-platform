import { UserModel } from "../schema/user.js";
import { verify_password } from "../utils/passwd.js";
import { getToken, tokenBlacklist } from "../auth/jwt.js";
import { dbClose, dbConnect } from "../database/dbConnect.js";

export const login = async (req, res) =>{
    const {email, password} = req.body
    try{
        if(email && password){
            await dbConnect()
            const user = await UserModel.findOne({email: email}).exec()
            if(!user){
                res.status(404).send("User not found")
            }
            else if(await verify_password(user.password, password)){
                const {_id, first_name, last_name, email, userType} = user
                const token = await getToken({first_name, last_name, _id, userType})
                res.status(200).json({_id, first_name, last_name, email, token, userType})
            }
            else{
                res.status(400).send("Incorrect login details")
            }    
        }
        else{
            res.status(200).send("email and passwowrd required")
        } 
    }
    catch(err){
        res.status(400).send(err.message)
    }finally {
        dbClose();
    }
}


export const logout = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    tokenBlacklist.add(token); // Add token to blacklist
    res.status(200).json({ message: "Logged out successfully!" });
};