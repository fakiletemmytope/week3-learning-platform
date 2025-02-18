import { Router } from "express";
import { isAdminOrInstructor, isInstructor, authenticate } from "../middleware/authenticate.js"
import {
    get_lesson,
    get_lessons,
    create_lesson,
    update_lesson,
    delete_lesson
} from "../controllers/lessonController.js";


const router = Router()

router.get('/', authenticate, get_lessons)
router.get('/:lesson_id', authenticate, get_lesson)
router.post('/', authenticate, isInstructor, create_lesson)
router.put('/:lesson_id', authenticate, isAdminOrInstructor, update_lesson)
router.delete('/:lesson_id', authenticate, isAdminOrInstructor, delete_lesson)

export const lesson_router = router