const mongoose = require('mongoose')

const productCollect = new mongoose.Schema({
    user_id:Number,
    cart_list :[
        {
            id_of_item:String,
            price_per_item:Number,
            title_id:String,
            item_image:String,
            item_quanitity:Number,
            price_for_quantity:Number
        }
    ],
})
module.exports = mongoose.model('productCollect', productCollect)