import mongoose from "mongoose"

const { Schema, model } = mongoose

const LessonType = {
    VIDEO: 'video',
    INTERACTIVE: 'interactive',
    SLIDE: 'slide'
}

const ResourceSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false });


const LessonSchema = new Schema(
    {
        topic: { type: String, required: true },
        objectives: {type: [String], required: true},
        lessonType: {
            type: String,
            enum: Object.values(LessonType),
            required: true
        },
        resources: {type: [ResourceSchema], required: false, default: null},
        instructor_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
        course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'courses' },

    }
)

export const LessonModel = model('lessons', LessonSchema)