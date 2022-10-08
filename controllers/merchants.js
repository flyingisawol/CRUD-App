const express = require('express')
const ensureLogin = require('connect-ensure-login')

const upload = require('../middlewares/upload')
const Merchants = require('../models/merchants')
const router = express.Router()

router.use(ensureLogin.ensureLoggedIn())

// INDEX
router.get('/lnmerch', async (req, res) => {
    const lnmerch = await Merchants.find()
    console.log(lnmerch)
    res.render('index.ejs', {
        lnmerch: lnmerch,
        tabTitle: 'home'
    })
})

// NEW Route
router.get('/lnmerch/new', (req, res) => {
    res.render('new.ejs')
})

//CREATE Route
router.post('/lnmerch', upload.single('image'), async (req, res) => {
    req.body.image = req.file.path
    await Merchants.create(req.body)
    req.flash('success', 'The lightning network grows stronger with you on it!')
    res.redirect('/lnmerch')
})  

//EDIT
router.get('/lnmerch/:id/edit', async (req, res) => {
    const editMerchant = await Merchants.findById(req.params.id)
    res.render('edit.ejs', {
        editMerchant: editMerchant,
    })
})

//UPDATE 
router.put('/lnmerch/:id', async (req, res) => {
    const merchant = await Merchants.findByIdAndUpdate(
        req.params.id, 
        req.body,
        {new: true}
    )
    console.log('Updated merchant', merchant)
    res.redirect('/lnmerch')
})

// DELETE CONFIRM route
router.get('/lnmerch/:id/delete', (req, res) => {
    res.render('confirm-delete.ejs', {
        id: req.params.id
    })
})

//DElETE Route
router.delete('/lnmerch/:id', async (req, res) => {
    const deletedMerchant = await Merchants.findOneAndRemove(req.params.id)
    console.log('Deleted Merchant:', deletedMerchant)
    res.redirect('/lnmerch')
})

// SHOW Route
router.get('/lnmerch/:id', async (req, res) => {
    const showMerchant = await Merchants.findById(req.params.id)
    res.render ('show.ejs', {
        showMerchant: showMerchant,
        tabTitle: showMerchant.name
    });
})


module.exports = router