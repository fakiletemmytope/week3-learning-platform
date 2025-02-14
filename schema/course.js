import mongoose from "mongoose"

const {Schema, model} =mongoose

const CourseSchema = new Schema(
    {    
        title: {type: String, required: true, unique: true},
        description: {type: String, required: true},
        duration: {type: String, required: true},
        price: {type: String, required: true},
        instructor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'instructors' },
    },
    { timestamps: true }
)

export const CourseModel = model('courses', CourseSchema)