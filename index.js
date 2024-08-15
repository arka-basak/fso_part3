const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()




let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.json())
morgan.token('req-body', (request) => {
  console.log(JSON.stringify(request.body))
  return JSON.stringify(request.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))



app.get('/', (request, response) =>{
    response.send('<h1>Hello World</h1>')
})
app.get('/info', (request, response)=>{
  const now = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}`)
})

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})
app.get('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person){
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.post('/api/persons',(request, response)=>{
  const body = request.body
  if (!body.name || !body.number){
    return response.status(400).json({ 
      error: 'need both name and number' 
    })
  }
  if (persons.find(person => person.name === body.name)){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  const person = {
    id: String(Math.floor(Math.random()*10000000)),
    name: body.name,
    number: body.number
  }
  console.log(person)
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  persons = persons.filter(person =>person.id !== id )
  response.status(204).end()
})


const PORT = 3001
app.listen(PORT, ()=>{
  currentTime = 
    console.log(`Server running on port ${PORT}`)
})