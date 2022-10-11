const multer = require('multer')
const cloudinary = require('cloudinary').v2 //SDK
const { CloudinaryStorage } = require('multer-storage-cloudinary')

require('dotenv').config()
cloudinary.config()

const upload = multer({
    storage: new CloudinaryStorage({ 
        cloudinary: cloudinary, // pointing to SDK
        params: {
            folder: 'merchants'
        }
    })
})

module.exports = upload