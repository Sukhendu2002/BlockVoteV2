import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Contract from "./models/Contracts.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//init contract
app.post("/init-contract", async (req, res) => {
  try {
    const { email } = req.body;
    const contract = new Contract({ email, contract: [] });
    //if email already exists
    const user = await Contract.findOne({ email });
    if (user) {
      res.status(200).json(user);
      return;
    }
    contract.save();
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//add contract
app.post("/add-contract", async (req, res) => {
  try {
    const { email, contract, name } = req.body;
    const user = await Contract.findOne({ email });
    //check if contract already exists
    const contractExists = user.contract.find((item) => item === contract);
    if (contractExists) {
      res.status(200).json(user);
      return;
    }
    user.contract.push({
      contract,
      name,
      date: new Date().toLocaleDateString(),
      status: "Not Started",
    });
    user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get contract
app.post("/get-contract", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Contract.findOne({ email });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//update contract
app.put("/update-contract", async (req, res) => {
  const { email, contract, status } = req.body;
  try {
    // Find the user by email
    const user = await Contract.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the contract to update
    const index = user.contract.findIndex((item) => item.contract === contract);

    if (index === -1) {
      return res.status(404).json({ error: "Contract not found" });
    }

    // Update the status
    user.contract[index].status = status;

    // Save the changes
    await user.save(); // Await the save operation

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.SERVER_PORT || 5000;
// eslint-disable-next-line no-undef
app.listen(PORT, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server is running on port ${PORT}`);
  mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    });
});
