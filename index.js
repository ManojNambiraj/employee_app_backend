const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let URL =
  "mongodb+srv://admin:admin123@cluster0.cpybg.mongodb.net/?retryWrites=true&w=majority";

let employees = [];

function authenticate(req, res, next) {
  if (req.header.authorization) {
    next();
  }
}

app.get("/employees", async function (req, res) {
  try {
    // Step1: Connect the db
    let connection = await mongoClient.connect(URL);

    // Step2: Select the Db
    let db = connection.db("employee");

    // Step 3&4:Select the connection and Do Operation
    let employees = await db.collection("employees_data").find().toArray();

    // Close the connection
    await connection.close();

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
});

app.post("/new-employee", async function (req, res) {
  try {
    // step 1: connect the Database
    let connection = new mongoClient(URL);
    await connection.connect();

    // Step 2: Select the DB
    let db = connection.db("employee");

    // Step 3 & 4:  Select the Collection & Do the Operation
    await db.collection("employees_data").insertOne(req.body);

    // step 5: Close the connection
    await connection.close();

    res.json({ message: "New Employee regitered" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong now" });
  }
});

app.get("/employee/:id", async function (req, res) {
  try {
    // step 1: Connect the DB
    let connection = await mongoClient.connect(URL);

    // step 2:Select the DB
    let db = connection.db("employee");

    // Step 3&4: Select the collection and Do Operation
    let employee = await db
      .collection("employees_data")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    // Step 5: Close the Connection
    await connection.close();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/edit/:id", async function (req, res) {
  try {
    // step 1: Connect the DB
    let connection = await mongoClient.connect(URL);

    // step 2:Select the DB
    let db = connection.db("employee");

    // Step 3&4: Select the collection and Do Operation
    await db
      .collection("employees_data")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );

    // Step 5: Close the Connection
    await connection.close();

    res.json({ message: "Employee Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/delete/:id", async function (req, res) {
  try {
    // step 1: Connect the DB
    let connection = await mongoClient.connect(URL);

    // step 2:Select the DB
    let db = connection.db("employee");

    // Step 3&4: Select the collection and Do Operation
    await db
      .collection("employees_data")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });

    // Step 5: Close the Connection
    await connection.close();

    res.json({ message: "Employee Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(process.env.port || 5000, () => {
  console.log("Server is running at PORT: 5000");
});
