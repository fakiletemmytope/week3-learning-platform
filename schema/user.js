import mongoose from "mongoose"

const {Schema, model} =mongoose



export const UserType = {
    ADMIN: 'admin',
    STUDENT: 'student',
    INSTRUCTOR: 'instructor',
};


const UserSchema = new Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        email:{type: String, required: true, unique: true },
        password: {type: String, required: true},
        userType: {
            type: String,
            enum: Object.values(UserType), // Restrict userType to the values of UserType
            required: true, // Optional: make it required if necessary
            default: UserType.STUDENT
        }
    },
    { timestamps: true }
)

export const UserModel = model('users', UserSchema)

