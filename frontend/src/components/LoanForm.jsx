import React, { useState } from "react";
import api from "../api";

const LoanForm = ({ onResult }) => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    principal: "",
    annualInterestRate: "",
    tenureYears: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/loan/calculate", {
        email: form.email,
        phone: form.phone,
        principal: Number(form.principal),
        annualInterestRate: Number(form.annualInterestRate),
        tenureYears: Number(form.tenureYears)
      });

      onResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating EMI"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-form">
      <h2>Home Loan EMI Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact Number *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Loan Amount (₹) *</label>
          <input
            type="number"
            name="principal"
            value={form.principal}
            required
            min="1"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Annual Interest Rate (%) *</label>
          <input
            type="number"
            step="0.01"
            name="annualInterestRate"
            value={form.annualInterestRate}
            required
            min="0"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Tenure (Years) *</label>
          <input
            type="number"
            name="tenureYears"
            value={form.tenureYears}
            required
            min="1"
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate EMI"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </div>
  );
};

export default LoanForm;

