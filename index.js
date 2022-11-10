import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { regValidation } from './validations/auth.js'
import UserModel from './models/User.js'
import User from './models/User.js'
import checkAuth from './utils/checkAuth.js'

dotenv.config()

const passDB = process.env.passDB
mongoose.connect(`mongodb+srv://Sergo:${passDB}@cluster0.ty0umqn.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB connection completed'))
    .catch(err => console.log(`DB connection failed: ${err}`))

const PORT = process.env.PORT || 5050
const app = express()

app.use(express.json())

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }
        const { password, ...userData } = user._doc
        res.json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unsuccessful authorization' })
    }
})

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: 'User don\'t found' })
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password)
        if (!isValidPassword) {
            return res.status(404).json({ message: 'Invalid email or password' })
        }
        const token = jwt.sign(
            { _id: user._id },
            'secret123',
            { expiresIn: '30d' }
        )
        const { password, ...userData } = user._doc
        res.json({ ...userData, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unsuccessful authorization' })
    }
})

app.post('/auth/register', regValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const pass = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(pass, salt)
        const doc = new UserModel({
            firstName: req.body.firstName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            password: hash,
        })
        const user = await doc.save()
        const token = jwt.sign(
            { _id: user._id },
            'secret123',
            { expiresIn: '30d' }
        )

        const { password, ...userData } = user._doc
        res.json({ ...userData, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unsuccessful registration' })
    }

})

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server started on PORT ${PORT}`)
})