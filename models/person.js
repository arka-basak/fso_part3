const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL
mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(result =>{
        console.log('Connected to MongoDB')
    })
    .catch(error=>{
        console.log('Error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (doc, ret) =>{
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)