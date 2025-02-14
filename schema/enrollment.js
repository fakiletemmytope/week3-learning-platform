import mongoose from "mongoose"

const { Schema, model } = mongoose

const EnrollmentSchema = new Schema(
    {
        course: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'courses' },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'}
    },
    { timestamps: true }
)

EnrollmentSchema.index({ course: 1, user: 1 }, { unique: true });

export const EnrollmentModel = model('enrollments', EnrollmentSchema)