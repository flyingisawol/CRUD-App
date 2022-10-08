const mongoose = require('mongoose')

const Merchants = require('../models/merchants.js')
const seedData = require('../seed/seed.js')

const dbURL = 'mongodb://localhost:27017/lnmerch'

mongoose.connect(dbURL, async () => {
  console.log('Connected to db')
  try {
    console.log('Inserting seed data')
    await Merchants.create(seedData)
    console.log('Added seed data')
  } catch (err) {
    console.log("ERROR:", err.message)
  }
  mongoose.connection.close()
})