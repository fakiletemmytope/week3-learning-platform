import { dbClose, dbConnect } from "../database/dbConnect.js"
import { LessonModel } from "../schema/lesson.js"
import {EnrollmentModel} from "../schema/enrollment.js"

const get_lessons = async () =>{
    const role = req.decode.userType
    try{
        await dbConnect()
        if(role == "admin"){
            const lessons = await LessonModel.find({})
            res.status(200).json(lessons)
        }

        if(role == "instructor"){
            const lessons = await LessonModel.find({instructor_id: req.decode._id})
            res.status(200).json(lessons)
        }

    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }

}

const get_lesson = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect();
        const lesson = await LessonModel.findById(req.params.lesson_id)
        if (!lesson) return res.status(404).send("Lesson not found")

        if (role === "admin" || (role === "instructor" && lesson.instructor_id === req.decode._id)) {
            return res.status(200).json(lesson)
        }

        if (role === "student") {
            const enrolled = await EnrollmentModel.findOne({ course: lesson.course_id, user: req.decode._id });
            if (!enrolled) return res.status(404).send("Student not enrolled for the course");
            return res.status(200).json(lesson)
        }

        return res.status(403).send("Unauthorized User")
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const create_lesson = async (req, res) =>{
    const { topic, objectives, lessonType, resources, instructor_id, course_id} = req.body
    try{
        await dbConnect()
        const lesson = new LessonModel({topic, objectives, lessonType, resources, instructor_id, course_id})
        const saved_lesson = await lesson.save()
        res.status(200).json(saved_lesson)
    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }
}


const update_lesson = async () =>{
    
}

const delete_lesson = async () =>{
    const role = req.decode.userType
    try{
        await dbConnect()
        if(role === "admin"){
            const lesson = LessonModel.findOneAndDelete({_id: req.params.lesson_id})
            if(!lesson) return res.status(404).send("Lesson not found")
            res.status(200).send("Lesson deleted")
        }

        if(role === "instructor"){
            const lesson = LessonModel.findOneAndDelete({_id: req.params.lesson_id, instructor_id: req.decode._id})
            if(!lesson) return res.status(404).send("Lesson not found")
            res.status(200).send("Lesson deleted")
        }

    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }
}


export { get_lesson, get_lessons, create_lesson, update_lesson, delete_lesson}