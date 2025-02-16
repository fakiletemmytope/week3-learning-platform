import { dbClose, dbConnect } from "../database/dbConnect.js"
import { LessonModel } from "../schema/lesson.js"
import { EnrollmentModel } from "../schema/enrollment.js"

const get_lessons = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect()
        if (role == "admin") {
            const lessons = await LessonModel.find({})
            res.status(200).json(lessons)
        }

        if (role == "instructor") {
            const lessons = await LessonModel.find({ instructor_id: req.decode._id })
            res.status(200).json(lessons)
        }
        if (role == "student") {
            const enrolled = await EnrollmentModel.find({ user: req.decode._id });
            const lessons = [];
    
            if (enrolled.length > 0) {
                const lessonPromises = enrolled.map(async (e) => {
                    const course = e.course;
                    const lesson = await LessonModel.find({ course_id: course });
                    console.log(lesson)
                    lessons.push(...lesson)
                    // return lesson
                })
                
                const lessonResults = await Promise.all(lessonPromises);

                // lessonResults.forEach(lessonArray => {
                //     lessons.push(...lessonArray);
                // });
            }
            res.status(200).json(lessons)
        }

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }

}

const get_lesson = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect();
        const lesson = await LessonModel.findById(req.params.lesson_id)
        if (!lesson) return res.status(404).send("Lesson not found")

        if (role === "admin" || (role === "instructor" && lesson.instructor_id == req.decode._id)) {
            res.status(200).json(lesson)
        }

        if (role === "student") {
            const enrolled = await EnrollmentModel.findOne({ course: lesson.course_id, user: req.decode._id });
            !enrolled ? res.status(404).send("Student not enrolled for the course") : res.status(200).json(lesson)
        }
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const create_lesson = async (req, res) => {
    const { topic, objectives, lessonType, resources, course_id } = req.body
    const instructor_id = req.decode._id
    try {
        await dbConnect()
        const lesson = new LessonModel({ topic, objectives, lessonType, resources, instructor_id, course_id })
        const saved_lesson = await lesson.save()
        res.status(200).json(saved_lesson)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}


const update_lesson = async (req, res) => {
    const role = req.decode.userType
    const { topic, objectives, lessonType, resources } = req.body
    console.log(resources)
    let update = {}
    if (topic) update.topic = topic
    if (objectives) update.objectives = objectives
    if (lessonType) update.lessonType = lessonType
    if (resources) update.resources = resources
    if (Object.keys(update).length === 0) {
        return res.status(400).send("topic/objectives/lessonType/resources field required");
    }
    try {
        await dbConnect()
        let updated_lesson = null

        if (role === "admin") {
            updated_lesson = await LessonModel.findOneAndUpdate(
                { _id: req.params.lesson_id },
                update,
                { new: true }
            )
        } else if (role === "instructor") {
            updated_lesson = await LessonModel.findOneAndUpdate(
                { _id: req.params.lesson_id, instructor_id: req.decode._id },
                update,
                { new: true }
            )
        }
        
        updated_lesson ? res.status(200).json(updated_lesson) : res.status(404).send("Lesson not found or not updated")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }

}

const delete_lesson = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect()
        let deleted_lesson = null
        if (role === "admin") {
            deleted_lesson = await LessonModel.findOneAndDelete({ _id: req.params.lesson_id })
            
        }

        if (role === "instructor") {
            deleted_lesson = await LessonModel.findOneAndDelete({ _id: req.params.lesson_id, instructor_id: req.decode._id }) 
        }

        !deleted_lesson ? res.status(404).send("Lesson not found") : res.status(200).send("Lesson deleted")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}


export { get_lesson, get_lessons, create_lesson, update_lesson, delete_lesson }