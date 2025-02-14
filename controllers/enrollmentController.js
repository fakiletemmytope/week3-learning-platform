import { dbClose, dbConnect } from "../database/dbConnect.js"
import { CourseModel } from "../schema/course.js"
import { EnrollmentModel } from "../schema/enrollment.js"

const enroll = async (req, res) =>{
    const course_id = req.params.courseId
    const student_id = req.decode._id
    console.log(course_id)
    try{
        await dbConnect()
        const course = await CourseModel.findById(course_id)
        if(!course) return res.status(404).send("Course not found")
        const enroll = new EnrollmentModel(
            {course: course_id, user: student_id}
        )
        const saved_enrolled = await enroll.save()
        res.status(200).json(saved_enrolled)

    }catch(error){
        console.log(error)
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }

}

const get_course_enrollments = async (req, res) =>{
    console.log("is it here?")
    const course_id = req.params.courseId
    const role = req.decode.userType
    try{
        let enrollments = null; // Initialize to null
        if (role === "admin") {
            await dbConnect();
            enrollments = await EnrollmentModel.find({ course: course_id });
        } else if (role === "instructor") {
            await dbConnect();
            const course = await CourseModel.findOne({ _id: course_id, instructor: req.decode._id });
            if (!course) return res.status(403).json({ message: "Unauthorized User" });

            enrollments = await EnrollmentModel.find({ course: course_id });
        }

        res.status(200).json(enrollments || []);
    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }
}


const get_all_enrollments = async (req, res) =>{
    try{
        await dbConnect()
        const enrollments = await EnrollmentModel.find({})
        res.status(200).json(enrollments)
    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }
}

export {enroll, get_course_enrollments, get_all_enrollments}