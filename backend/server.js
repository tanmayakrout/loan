import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(cors({
  origin: "*", // in prod, restrict to your frontend domain
}));
app.use(express.json());

/**
 * EMI Formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * P = principal
 * r = monthly interest rate = annual_rate / (12 * 100)
 * n = tenure in months = years * 12
 */
function calculateEMI(principal, annualRate, tenureYears) {
  const n = tenureYears * 12;
  const r = annualRate / (12 * 100);

  if (r === 0) {
    return principal / n;
  }

  const numerator = principal * r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  return numerator / denominator;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Home Loan EMI API is running" });
});

// Calculate EMI + save record
app.post("/api/loan/calculate", async (req, res) => {
  try {
    const { email, phone, principal, annualInterestRate, tenureYears } = req.body;

    // Basic validation
    if (!email || !phone || !principal || !annualInterestRate || !tenureYears) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const P = parseFloat(principal);
    const R = parseFloat(annualInterestRate);
    const T = parseInt(tenureYears, 10);

    if (P <= 0 || R < 0 || T <= 0) {
      return res.status(400).json({ message: "Invalid numeric values" });
    }

    const emi = calculateEMI(P, R, T);
    const emiRounded = Number(emi.toFixed(2));

    // Save to DB
    const sql =
      "INSERT INTO loan_applications (email, phone, principal, annual_interest_rate, tenure_years, emi_amount) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [email, phone, P, R, T, emiRounded];

    const [result] = await pool.execute(sql, params);

    res.status(201).json({
      id: result.insertId,
      email,
      phone,
      principal: P,
      annualInterestRate: R,
      tenureYears: T,
      emiAmount: emiRounded
    });
  } catch (error) {
    console.error("Error in /api/loan/calculate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get history
app.get("/api/loan/history", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, phone, principal, annual_interest_rate AS annualInterestRate, tenure_years AS tenureYears, emi_amount AS emiAmount, created_at AS createdAt FROM loan_applications ORDER BY created_at DESC LIMIT 50"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error in /api/loan/history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

