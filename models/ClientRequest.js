const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ClientRequestSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    signUpDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const clientRqModel = mongoose.model('clientRqModel', ClientRequestSchema);

module.exports = clientRqModel;