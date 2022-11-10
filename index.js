import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import multer from 'multer'
import { regValidation, 
        loginValidation, 
        postCreateValidation } from './validations/validations.js'
import {handleValidationErrors, checkAuth} from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'

dotenv.config()
const PORT = process.env.PORT || 5050
const passDB = process.env.passDB
const app = express()
app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose.connect(`mongodb://Sergo:${passDB}@ac-epcbwbf-shard-00-00.ty0umqn.mongodb.net:27017,ac-epcbwbf-shard-00-01.ty0umqn.mongodb.net:27017,ac-epcbwbf-shard-00-02.ty0umqn.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-qpqquo-shard-0&authSource=admin&retryWrites=true&w=majority`)
    .then(() => console.log('DB connection completed'))
    .catch(err => console.log(`DB connection failed: ${err}`))

const storage = multer.diskStorage({   
    destination: (_, __, cb) => {
        cb(null, 'uploads')            
    },
    filename: (_, file, cb) =>{         
        cb(null, file.originalname)
    }   
})

const upload = multer({storage})       

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({ url: `/uploads/${req.file.originalname}`})
})

app.get('/auth/me', checkAuth, UserController.authMe)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.loginUser)
app.post('/auth/register', regValidation, handleValidationErrors, UserController.register)

app.get('/posts', PostController.getPosts)
app.get('/posts/:id', PostController.getOnePost)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.crestePost)
app.patch('/posts/:id', checkAuth, handleValidationErrors, PostController.updatePost)
app.delete('/posts/:id', checkAuth, PostController.deletePost)

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server started on PORT ${PORT}`)
})