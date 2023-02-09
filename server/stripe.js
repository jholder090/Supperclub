require('dotenv').config();
const express = require("express");
const app = express.Router()
module.exports = app
const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY)
console.log("PROCESS API STUFF, ", process.env, "<<<<<<<")

// POST /payment
app.post("/payment", async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);
        console.log("SPREAD BOOKING,", {...req.body, reservedSeats})

      const { suggestedDonation, reservedSeats: reservedSeats } = req.body;

      console.log("suggestedDonation and reservedSeats", {suggestedDonation, reservedSeats})
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: suggestedDonation * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      console.log("paymentIntent", paymentIntent)
      console.log("paymentIntent secret", paymentIntent.client_secret)
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.log(err);
    }
  });