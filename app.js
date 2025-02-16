import express from "express"
import { user_router } from "./routes/user.js"
import bodyParser from "body-parser"
import { auth_router } from "./routes/auth.js";
import { course_router } from "./routes/course.js";
import { enrollment_router } from "./routes/enrollment.js";
import { lesson_router } from "./routes/lesson.js";


const app = express()
const PORT = 3000

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Use the router
app.use("/auth", auth_router)
app.use('/api/users', user_router);
app.use('/api/courses', course_router);
app.use('/api/enrollments', enrollment_router)
app.use('/api/lessons', lesson_router)



app.listen(PORT, ()=>{
    console.log(`This is a mini learning platforn listening on port ${PORT}`)
})