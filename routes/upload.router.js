import { Router } from "express";
import UploadController from "../controllers/upload.controller.js";



const uploadRouter = Router()


uploadRouter.post('/photo', UploadController.uploadPhoto)
uploadRouter.post('/file', UploadController.uploadFile)


export default uploadRouter