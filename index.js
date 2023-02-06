// MINI-Project

// Name Ashvani Singh Gurjar 
// College - Aith
// Branch - Cse
// PassOut - 2024

const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const app = express();
const listRoute = require("./routes/list");
const router = express.Router();
const mongoose = require('mongoose');

let temp = require("temp");
app.use(temp());

const PORT = 3001;
var database;
app.use(express.json());
app.use(listRoute);

MongoClient.connect(
  dotenv.config().parsed.SECRET,
  { useNewUrlParser: true },
  (error, result) => {
    if (error) {
      throw error;
    }
    database = result.db("GurjarData");
    console.log("Connection done");
  }
);

app.get("/g", (req, res) => {
  res.status(200).send({
    msg: "Gurjar is a king",
  });
});

app.get("/get/:listing", async (req, res) => {
  const listing_name = req.params.listing;
  try {
    const data = await database
      .collection("listingsAndReviews")
      .findOne({ name: listing_name });
    res.status(201).send(data);
  } catch (e) {
    console.log("NO Data");
  }
});

app.post("/newListing", async (req, res) => {
  const listing = req.body;
  try {
    const data = await database
      .collection("listingsAndReviews")
      .insertOne(listing);
    res.status(200).send({
      remark: "Success",
      id: data.insertedId,
    });
  } catch (e) {
    console.log("Error");
  }
});

app.listen(PORT, () => {
  console.log("Runnin");
});



mongoose.connect('mongodb://localhost:27017/GurjarData', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  role: String
});


const User = mongoose.model('User', userSchema);


router.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  User.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
