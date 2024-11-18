const payment = require("../model/payment");
const Payment = require("../model/payment");

exports.getAllPaymentByUser = async(req,res)=>{
    try {
        const userId = req.params.id;
        const payments = await Payment.find({user:userId});

        if(payments.length === 0){
            return res.status(404).json({message:"no payment found "});
        }

        res.status(200).json(payments);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

exports.createPayment = async(req,res)=>{
    try{
        const {user,order,amount,method,transactionId} = req.body;

        const newPayment = new Payment({
            user,
            order,
            amount,
            method,
            transactionId
        });

        await newPayment.save();
        res.status(201).json({message:"payment created successfully",payment:newPayment});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

exports.updatePaymentStatus = async(req,res)=>{
    try{
        const paymentId = req.params.id;
        const {paymentStatus} = req.body;

        const payment = await Payment.findById(paymentId);
        if(!payment){
            return res.status(404).json({message:"Payment not found "});
        }

        payment.paymentStatus = paymentStatus;
        await payment.save();

        res.status(200).json({message:"Payment method is Updated successfully",payment});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

exports.cancelPayment = async(req,res)=>{
    try{
        const paymentId = req.params.id;
        const payment = await Payment.findById(paymentId);

        if(!payment){
            return res.status(404).json({message:"Payment not found"});
        }

        if(payment.paymentStatus !== 'Pending'){
            return res.status(400).json({message:"Only pending payments can be cancelled"});
        }

        payment.paymentStatus = "Cancelled";
        await payment.save();

        res.status(200).json({message:"Payment cancelled successfully",payment});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}