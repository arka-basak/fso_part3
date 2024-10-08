require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
morgan.token('req-body', (request) => {
  console.log(JSON.stringify(request.body))
  return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})


app.get('/info', (request, response, next) => {
  const now = new Date()
  Person.find({})
    .then((persons) => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}`)
    })
    .catch(error => next(error))
})



app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response ,next) => {
  Person.findById(request.params.id)
    .then(persons => {
      if (persons){
        response.json(persons)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons',(request, response, next) => {
  const body = request.body
  if (!body.name || !body.number){
    return response.status(400).json({
      error: 'need both name and number'
    })
  }

  Person.findOne({ name: body.name }).then((result) => {
    if(result){
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const newPerson = new Person(body)
    newPerson.save()
      .then(() => {
        response.json(newPerson)
      })
      .catch(error => next(error))
  })
})
app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = {
    'name': request.body.name,
    'number': request.body.number,
    'id': request.params.id
  }

  Person.findByIdAndUpdate(request.params.id, updatedPerson,{ new:true, runValidators: true, context: 'query' })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response ,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
  // const id = request.params.id
  // persons = persons.filter(person =>person.id !== id )
  // response.status(204).end()
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})