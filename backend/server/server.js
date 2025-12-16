import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo DB error:", err));

const transactionSchema = new mongoose.Schema({
  type: String,
  category: String,
  amount: Number,
  comment: String,
  date: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

app.get("/api/transactions", async (req, res) => {
  const items = await Transaction.find();
  res.json(items);
});

app.post("/api/transactions", async (req, res) => {
  const tx = await Transaction.create(req.body);
  res.json(tx);
});

app.delete("/api/transactions/:id", async (req, res) => {
  const result = await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true, deleted: result });
});

app.post("/api/transactions/import", async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Expected array of transactions" });
    }

    const saved = await Transaction.insertMany(data);
    res.status(201).json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Import failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
