const router = require('express').Router();
const clientRqModel = require('../models/ClientRequest');
const formatPhoneNumber = require('../helpers/formatPhoneNum')
const {ensureAuthenticated} = require('../helpers/checkKey')
require('dotenv').config()


// REQUIRE JOI
const Joi = require('@hapi/joi');
// DEFINE JOI SCHEMA
const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().trim().regex(/^[0-9]{7,10}$/).required()
})


// REQUIRE NEXMO
const Nexmo = require('nexmo');
// CONFIG NEXMO
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API,
  apiSecret: process.env.NEXMO_PS,
});


// ROUTE TO SUBMIT FORM TO
router.post('/',ensureAuthenticated, async (req, res) =>{
    
    
    // VALIDATION
    const validation = schema.validate(req.body)
    // CHECKING FOR ERRORS
    const {error} = validation
    if(error) return res.status(400).send(error.details[0].message);
    // CHECKING IF CLIENT EXISTS
    const clientAlreadyExists = await clientRqModel.findOne({email: req.body.email});
    if(clientAlreadyExists) return res.status(400).send("EMAIL ALREADY EXISTS");

    // CREATING A NEW CLIENT
    let newClient = new clientRqModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    });
    // SET UP SMS CONFIGURATION
    const from = '17035968644';
    const to = `1${process.env.ADMIN}`;
    const text = `You just recieved a new signup from ${newClient.firstName} ${newClient.lastName}. Their email address is ${newClient.email} and their phone number is ${formatPhoneNumber(newClient.phoneNumber)}`;

    // NEED TO ADD EMAIL FUNCTIONALITY NOW
    try{
        // SEND TEXT MESSAGE AND VIEW EITHER THE ERRORS OR THE SUCCESS/COST
        nexmo.message.sendSms(from, to, text, {type: 'unicode'},
        (err, responseData) => {
            if(err){
                console.log(err)
            }else{
                console.dir(responseData)
            }
        });
        // SAVE NEW CLIENT CONTACT
        const savedClient = await newClient.save();
        res.send(savedClient)
    }catch (err){
        res.status(404).send(err);
    }
})



module.exports = router;