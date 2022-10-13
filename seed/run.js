require('dotenv').config()

const mongoose = require('mongoose')


const Merchants = require('../models/merchants.js')
const seedData = require('../seed/seed.js')

const dbURL = process.env.MONGODB_URL

mongoose.connect(dbURL, async () => {
  console.log('Connected to db')
  try {
    console.log('Inserting seed data')
    await Merchants.create(seedData)
    console.log('Added seed data')
  } catch (err) {
    console.log("ERROR: ", err.message)
  }
  mongoose.connection.close()
})