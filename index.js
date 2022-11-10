import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { regValidation, 
        loginValidation, 
        postCreateValidation } from './validations/validations.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController .js'

dotenv.config()
const PORT = process.env.PORT || 5050
const passDB = process.env.passDB
const app = express()
app.use(express.json())

mongoose.connect(`mongodb://Sergo:${passDB}@ac-epcbwbf-shard-00-00.ty0umqn.mongodb.net:27017,ac-epcbwbf-shard-00-01.ty0umqn.mongodb.net:27017,ac-epcbwbf-shard-00-02.ty0umqn.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-qpqquo-shard-0&authSource=admin&retryWrites=true&w=majority`)
    .then(() => console.log('DB connection completed'))
    .catch(err => console.log(`DB connection failed: ${err}`))

app.get('/auth/me', checkAuth, UserController.authMe)
app.post('/auth/login', loginValidation, UserController.loginUser)
app.post('/auth/register', regValidation, UserController.register)

app.get('/posts', PostController.getPosts)
app.get('/posts/:id', PostController.getOnePost)
app.post('/posts', checkAuth, postCreateValidation, PostController.crestePost)
app.patch('/posts/:id', checkAuth, PostController.updatePost)
app.delete('/posts/:id', checkAuth, PostController.deletePost)

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server started on PORT ${PORT}`)
})