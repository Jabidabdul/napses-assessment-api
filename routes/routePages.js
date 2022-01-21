const express = require('express');
const app = express();
const route = express.Router();
const axios = require('axios');
const productCollection= require('../models/productCollection')
var bodyParser = require('body-parser');

route.use(bodyParser.json());

route.get('/menu', (req, res)=>{
    var config = {
        method: 'get',
        url: process.env.PRODUCT_API,
        headers: { }
      };
      axios(config)
      .then(function (response) {
        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
})
route.get('/cart/getitem',async(req, res)=>{
  const userId = 1;
  let collection = await productCollection.findOne({user_id : userId })
  if(collection){
    res.send(collection)
  }
})

route.post('/cart/additem', async (req, res)=>{
  const {userId=1,prodId, title, price, image} = req.body;
  let collection = await productCollection.findOne({user_id : userId })
  if(collection){
    try {
      let quantity = collection.cart_list.find(element=> element.id_of_item == prodId);
      if(quantity){
        let newItem = await productCollection.findOneAndUpdate({user_id : userId, "cart_list.id_of_item" : prodId},{
          $set : {
            "cart_list.$.item_quanitity" : quantity.item_quanitity+1,
            "cart_list.$.price_for_quantity" : (quantity.item_quanitity+1)*(quantity.price_per_item)
          }
        },{new : true})
      res.send(newItem)
      }
      else{
        let newItem = await productCollection.findOneAndUpdate({user_id : userId}, {
          $push : {cart_list : {
                    id_of_item:prodId,
                    price_per_item:price,
                    title_id:title,
                    item_quanitity:1,
                    item_image : image,
                    price_for_quantity:price
          }}
        })
        let newCollection = await productCollection.findOne({user_id : userId })
        res.send(newCollection)
      }
    }catch(error){
      console.log(error)
    }
    
  }else{
    const addProduct = new productCollection(
              { user_id : userId,
                cart_list : {
                  id_of_item:prodId,
                  price_per_item:price,
                  title_id:title,
                  item_quanitity:1,
                  item_image : image,
                  price_for_quantity:price
              },
              })
              addProduct.save()
              .then(data=>{
                  res.send(data)
              })
              .catch(err=>{
                  res.send(err)
              }) 
  }
})
route.post('/cart/deleteitem', async(req, res)=>{
  const {userId=1,deleteitem, whole_item : whole_item} = req.body;
  let collection = await productCollection.findOne({user_id : userId })
  if(collection){
      let quantity = collection.cart_list.find(element=> element.id_of_item == deleteitem);
      if(!quantity) res.send(collection)
      if(whole_item == 1){
        let newItem = await productCollection.findOneAndUpdate({user_id : userId, "cart_list.id_of_item" : deleteitem},{
          $set : {
            "cart_list.$.item_quanitity" : quantity.item_quanitity+1,
            "cart_list.$.price_for_quantity" : (quantity.item_quanitity+1)*(quantity.price_per_item)
          }
        },{new : true})
      res.send(newItem)
      }
      else if(whole_item == 0){
        if(quantity.item_quanitity > 1){
          let newItem = await productCollection.findOneAndUpdate({user_id : userId, "cart_list.id_of_item" : deleteitem},{
            $set : {
              "cart_list.$.item_quanitity" : quantity.item_quanitity-1,
              "cart_list.$.price_for_quantity" : (quantity.item_quanitity-1)*(quantity.price_per_item)
            }
          },{new : true})
          res.send(newItem)
        }
        
      }
      else if(whole_item == -1){
          let newItem = await productCollection.updateOne({ user_id: userId },{"$pull": { "cart_list": {"id_of_item": quantity.id_of_item}}})
            let newCollection = await productCollection.findOne({user_id : userId })
            res.send(newCollection)
      }
      else{
        let newCollection = await productCollection.findOne({user_id : userId })
        res.send(newCollection)
      }

  }
})

  
module.exports = route;
