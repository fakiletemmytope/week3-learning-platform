import { decode } from "jsonwebtoken"
import { dbClose, dbConnect } from "../database/dbConnect.js"
import { course_router } from "../routes/course.js"
import { CourseModel } from "../schema/course.js"

const get_courses = async (req, res) =>{
    try{
        await dbConnect()
        const courses = await CourseModel.find({}, "title instructor duration _id price description")
        res.status(200).json(courses)
    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    } 
}

const get_course = async (req, res) =>{
    const id = req.params.id
    try{
        await dbConnect()
        const course = await CourseModel.findById(id, "title instructor duration _id price description")
        if(!course) return res.status(404).send("Course not found")
        res.status(200).json(course)
    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    } 
}


const create_course = async (req, res) =>{
    const {title, description, price, duration} = req.body
    const course = new CourseModel({title, description, price, duration, instructor: req.decode._id  })
    try{
        dbConnect()
        const savedCourse = await course.save()
        res.status(200).json(savedCourse)
    }catch(err){
        res.status(400).send(err.message)
    }finally{
        dbClose()
    }   
}

const update_course = async (req, res) =>{
    const {title, description, duration, price} = req.body
    const update = {}
    if (title) update.title = title 
    if (description) update.description = description
    if (duration) update.duration = duration
    if (price) update.price = price
    if (Object.keys(update).length === 0) {
        res.status(400).send("Nothing to update");
        return
    }
    try{
        await dbConnect()
        const updated_course = await CourseModel.findOneAndUpdate(
            {_id: req.params.id, instructor: req.decode._id},
            update,
            {new: true}
        )
        if(!updated_course) return res.status(404).send("Course not found")
        res.status(200).json(updated_course)

    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }  
}

const delete_course = async (req, res) =>{
    try{
        await dbConnect()
        const deleted_course = await CourseModel.findOneAndDelete(
            {_id: req.params.id, instructor: req.decode._id}
        )
        if(!deleted_course) return res.status(404).send("Course not found")

        res.status(200).json(deleted_course)
    }catch(error){
        res.status(400).send(error.message)
    }finally{
        dbClose()
    }
}

export { get_course, get_courses, update_course, delete_course, create_course}