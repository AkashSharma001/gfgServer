const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const expressListEndpoints = require('express-list-endpoints');
const morgan = require('morgan');
//IMPORT ROUTES

const productRoute = require("./routes/product-routes");
const userRoute = require("./routes/user-routes");
const sellerRoute = require("./routes/seller-routes");
const orderRoute = require("./routes/order-routes");

dotenv.config();

//CONNECTION TO DATABASE

mongoose.connect(
  `mongodb+srv://backpro:FFOCaBgoNL1Tkatb@cluster0.podflh0.mongodb.net/gfgCode-prod?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useCreateIndex: true, //make this true
    autoIndex: true, //make this also true
  },
  () => console.log("connected to db")
);
//MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json(), cors());

//ROUTE MIDDLEWARE
app.get('/endpoints', (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({
    message: "Welcome to the API endpoints page. Here's a list of all available endpoints:",
    endpoints: endpoints
  }, null, 2));
});


app.use("/api/user", userRoute);
app.use("/api/seller", sellerRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);

app.get("/", (req, res) => {
  res.send(`<h3>Hey! Agro Backend is up !</h3>`);
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));
