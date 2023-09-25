import { v4 } from 'uuid'
import fs from 'fs'
import Photo from '../models/Photo.model.js'
import File from '../models/File.model.js'

class UploadController {
    async uploadPhoto(req, res) {
        try {

            const file = req.files.file
            if (file.size > 50000000) { // 50mb
                return res.status(400).json({ message: 'the file cannot weigh more than 50mb' })
            }

            const fileName = v4() + ".png"
            file.mv('uploads' + '/' + fileName)
            const newPhoto = await Photo.create({ path: '/' + fileName })

            res.json({ message: 'file succesfully uploaded', path: `/${fileName}` })


        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'upload error', error })
        }
    }


    async uploadFile(req, res) {
        try {

            const file = req.files.file
            if (file.size > 50000000) { // 50mb
                return res.status(400).json({ message: 'the file cannot weigh more than 50mb' })
            }

            const fileName = v4()
            file.mv('uploads' + '/' + fileName)

            res.json({ message: 'file succesfully uploaded', path: `/${fileName}` })

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'upload error', error })
        }
    }
}

export default new UploadController()