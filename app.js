const express = require('express');
const cors = require('cors')
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const db = require('./config/keys');
const Schema = mongoose.Schema;

const ClientRequestSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number
})

const clientRqModel = mongoose.model('clientRqModel', ClientRequestSchema);
//CONNECT TO MONGODB
mongoose.connect(
    db, 
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
    console.log('MONGODB CONNECTED');
}).catch(err => console.log(err));


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());




app.post('/', (req, res) =>{
    let newRequest = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }
    if(! newRequest.firstName || ! newRequest.lastName || !newRequest.email || ! newRequest.phoneNumber){
        res.json({msg: "GO BACK AND FILL IN ALL FORMS"})
    }else{
        let newClient = new clientRqModel(newRequest)
        newClient.save()
            .then(() => {
                console.log(newClient)
                res.end();
            })
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}....`);
})