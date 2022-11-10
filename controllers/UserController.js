import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
    try {
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

}

export const authMe = async (req, res) => {
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
}

export const loginUser = async (req, res) => {
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
}