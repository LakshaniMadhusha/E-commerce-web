import express from "express"
import student from "../models/student.js"
import { getStudents, createStudents } from "../controllers/studentController.js";

const studentRouter=express.Router()

studentRouter.get("/",getStudents)  

studentRouter.post("/",createStudents)

export default studentRouter;