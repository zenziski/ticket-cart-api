const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    on_cart: [{
        _id: false,
        ticketId: String,
        quantity: Number
    }]
},
);

module.exports = mongoose.model("cart", schema);