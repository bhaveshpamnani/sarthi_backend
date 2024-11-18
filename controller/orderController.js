const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose'); 


///---===Create Order---===///

exports.createOrder = async (req, res) => {z
    try {
      const { user, items, shippingAddress, totalAmount, paymentStatus, orderStatus } = req.body;
  
      // Convert user to ObjectId if it is a string
      const userId = new mongoose.Types.ObjectId(user);
  
      // Map items array and convert each product to ObjectId
      const orderItems = items.map(item => ({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity,
        price: item.price
      }));
  
      const newOrder = new Order({
        user: userId,
        items: orderItems,
        shippingAddress,
        totalAmount,
        paymentStatus,
        orderStatus
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating order', error });
    }
  };


///---===Update Order status---===///
exports.updateOrderStatus = async (req,res)=>{
    try{
        const orderId = req.params.id;
        const {orderStatus,paymentStatus,deliveredAt} = req.body;

        //Find the Order By id
        const order = await Order.findById(orderId);

        if(!order) return res.status(404).json({message:`Order not found`});

        //Update Fields of Order
        if(orderStatus) order.orderStatus = orderStatus;
        if(paymentStatus) order.paymentStatus = paymentStatus;
        if(deliveredAt) order.deliveredAt = deliveredAt;

        await order.save();
        res.status(200).json({message:"Order Updated SuccessFully",order});

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

///---===Cancle Order---===///
exports.cancelOrder = async (req,res)=>{
    try{
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({message:`Order not found`});
        if(order.orderStatus === 'Cancelled') return res.status(400).json({message:"Order is Already Cancelled"});
        if(order.orderStatus === "Shipped") return res.status(400).json({message:"Cannot cancel a shipped order "});
        if(order.orderStatus === "Delivered") return res.status(400).json({message:"Cannot cancel a Delivered order "});

        order.orderStatus = "Cancelled";
        order.paymentStatus = "Refunded";
        await order.save();
        res.status(200).json({message:"Order Cancelled SuccessFully",order});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

///---===Update shipping address---===///
exports.updateShippingAddress = async (req,res)=>{
    try{
        const orderId = req.params.id;
        const {userId,shippingAddress} = req.body;

        const order = await Order.findById({_id:orderId,user:userId});
        if(!order) return res.status(404).json({message:`Order not found`});

        order.shippingAddress = shippingAddress;
        await order.save();
        res.status(200).json({message:"Shipping Address Updated SuccessFully",order});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

///---===Get all Order of User---===///
exports.getAllOrder = async (req,res)=>{
    try{
        const userId = req.params.id;
        const orders = await Order.find({user:userId}).populate('items.product');
        if(!orders || orders.length === 0 ) return res.status(404).json({message:"No Order found"});
        res.status(200).json({message:"All Order of User",orders});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}