const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const registerRouter = require('./routes/register');



dotenv.config();


//CONNECT TO MONGODB
const db = process.env.DB_PASSWORD
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


app.use('/register', registerRouter);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}....`);
})