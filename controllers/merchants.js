const express = require('express')
const ensureLogin = require('connect-ensure-login')

const upload = require('../middlewares/upload')
const Merchants = require('../models/merchants')
const router = express.Router()

router.use(ensureLogin.ensureLoggedIn())


// INDEX
router.get('/merchants', async (req, res) => {
    // console.log(req.body)
    res.render('index.ejs', {
    })
})

// SEARCH
router.get('/merchants/search', async (req, res) => {
    const filters = req.query.Search 
    const merchants = await Merchants.find()
    let resultsArray = []
    for (merchant of merchants) {
        for (key in merchant) {
            if (Array.isArray(merchant[key])) {
                for (propertyArrayItem of merchant[key]) {
                    console.log(propertyArrayItem)
                    const regex = new RegExp(filters, 'i')
                    if (regex.test(propertyArrayItem)) {
                        if (!resultsArray.includes(merchant)) {
                            resultsArray.push(merchant)
                        }
                    }
                }
            } else {
                const regex = new RegExp(filters, 'i') //changes search form entry to case insensitive substring
                if (typeof merchant[key] === 'string' && regex.test(merchant[key])) { // tests if true and add to arry
                    if (!resultsArray.includes(merchant)) {
                        resultsArray.push(merchant)
                    }

                }
            }
        }
    } 
    if (resultsArray.length === 0) {
        res.render('nosearchresult.ejs') 
    } else {
        res.render('all.ejs', {
        lnmerch: resultsArray
    })
    }
})

// SEE-ALL LIST
router.get('/merchants/all', async (req, res) => {
    try {
    const lnmerch = await Merchants.find()
    if (lnmerch) {
        res.render('all.ejs', {
            lnmerch: lnmerch,
        })
    } else {
        throw new Error('Oopsies broke LND')
    }
    } catch {
        next()
    }
})

// NEW Route
router.get('/merchants/new', (req, res) => {
    res.render('new.ejs')
})

//CREATE Route
router.post('/merchants', upload.single('image'), async (req, res) => {
    req.body.image = req.file.path
    await Merchants.create(req.body)
    req.flash('success', 'The lightning network grows stronger with you on it!')
    res.redirect('/merchants')
})  

//EDIT
router.get('/merchants/:id/edit', async (req, res) => {
    try {
    const editMerchant = await Merchants.findById(req.params.id)
    if (editMerchant) {
        res.render('edit.ejs', {
        editMerchant: editMerchant,
    })
    } else {
        throw new Error('Ooopsies. Error Editing')
    }
} catch {
    next()
}
})

//UPDATE 
router.put('/merchants/all/:id', async (req, res) => {
    const merchant = await Merchants.findByIdAndUpdate(
        req.params.id, 
        req.body,
        {new: true}
    )
    console.log('Updated merchant', merchant)
    res.redirect('/merchants')
})

// DELETE CONFIRM route
router.get('/merchants/:id/delete', (req, res) => {
    res.render('confirm-delete.ejs', {
        id: req.params.id
    })
})

//DElETE Route
router.delete('/merchants/:id', async (req, res) => {
    const deletedMerchant = await Merchants.findOneAndRemove(req.params.id)
    console.log('Deleted Merchant:', deletedMerchant)
    res.redirect('/merchants')
})

// SHOW Route
router.get('/merchants/all/:id', async (req, res) => {
    const showMerchant = await Merchants.findById(req.params.id)
    res.render ('show.ejs', {
        showMerchant: showMerchant,
        tabTitle: showMerchant.name
    });
})


module.exports = router