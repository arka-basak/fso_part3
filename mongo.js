const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('Missing arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.7bf42.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)


mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 3){
  Person.find({}).then(result => {
    console.log('Phonebook')
    result.forEach( person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}else{
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson.save().then( () => {
    console.log(`added ${newPerson.name} ${newPerson.number} to phonebook`)
    mongoose.connection.close()
  })
}

