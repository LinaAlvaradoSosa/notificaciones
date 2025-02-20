import express from "express";
import { createStudent, getStudentById, getStudents, updatStudent } from "../controllers/students.controller.js";

const router = express.Router()

router.post('/createStudent', createStudent);
router.get('/getStudents', getStudents)
router.get('/getStudentById/:id', getStudentById)
router.put('/updatStudent-payments/:id', updatStudent)


export default router