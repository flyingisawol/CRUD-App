const mongoose = require('mongoose')

const merchantsSchema = new mongoose.Schema({
  name: {type: String},
  address: {
    street: String,
    suburb: String,
    city: String,
    state: String,
    country: String,
    postcode: Number
  },
  website: {type: String},
  image: {type: String},
  description: {type: String},
  type: [String],
  discount: {type: Number},
  onChain: {type: String}
})

const Merchants = mongoose.model('Merchants', merchantsSchema)

module.exports = Merchants