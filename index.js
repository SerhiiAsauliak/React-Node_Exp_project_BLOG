import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

dotenv.config() 
const passDB = process.env.passDB
mongoose.connect(`mongodb+srv://Sergo:${passDB}@cluster0.ty0umqn.mongodb.net/?retryWrites=true&w=majority`).then(() => console.log('DB connection completed'))
.catch(err => console.log(`DB connection failed: ${err}`))

const PORT = process.env.PORT || 5050
const app = express()

app.use(express.json())  
app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(PORT, (err) => {
    if(err){
        return console.log(err)
    }
    console.log(`Server started on PORT ${PORT}`)})