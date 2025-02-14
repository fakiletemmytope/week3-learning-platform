import mongoose from "mongoose"

const {Schema, model} = mongoose

const InstructorSchema = new Schema(
    {
        name: {type: String, required: true},
        bio: {type: String, required: true, default: null},
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    },
    {timestamps: true}
)

export const InstructorModel = model('instructors', InstructorSchema)