const mongoose = require('mongoose')

const merchantsSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  website: {type: String, required: true},
  image: {type: String, required: true},
  description: {type: String, required: true},
  type: {type: String, required: true},
  discount: {type: Number, required: true},
})

const Merchants = mongoose.model('Merchants', merchantsSchema)

module.exports = Merchants