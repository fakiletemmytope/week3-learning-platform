import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
    create_course,
    get_courses,
    update_course,
    delete_course,
    get_course
} from "../controllers/courseController.js";
import { isInstructor, isAdminOrInstructor } from "../middleware/authenticate.js";

const router = Router()


router.get("/", get_courses)

router.get("/:id", get_course)

router.post("/", authenticate, isInstructor, create_course)

router.put("/:id", authenticate, isAdminOrInstructor, update_course)

router.delete("/:id", authenticate, isAdminOrInstructor, delete_course)

export const course_router = router