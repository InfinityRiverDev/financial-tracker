import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", // позже можно заменить на vercel-домен
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const transactionSchema = new mongoose.Schema({
  type: String,
  category: String,
  amount: Number,
  comment: String,
  date: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);


// GET all
app.get("/api/transactions", async (req, res) => {
  const items = await Transaction.find();
  res.json(items);
});

// CREATE one
app.post("/api/transactions", async (req, res) => {
  const tx = await Transaction.create(req.body);
  res.json(tx);
});

// DELETE one
app.delete("/api/transactions/:id", async (req, res) => {
  const result = await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true, deleted: result });
});

// IMPORT JSON
app.post("/api/transactions/import", async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        message: "Expected array of transactions",
      });
    }

    const saved = await Transaction.insertMany(data);
    res.status(201).json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Import failed" });
  }
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
