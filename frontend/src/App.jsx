import { useState, useEffect } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    principal: "",
    annualInterestRate: "",
    tenureYears: "",
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/loan/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/loan/calculate", form);
      fetchHistory();
      alert("EMI calculated successfully!");
    } catch (err) {
      alert("Something went wrong! Check backend.");
    }
    setLoading(false);
  };

  return (
    <div className="main-container">
      <h1 className="title">Home Loan EMI Calculator by vipin</h1>
      <p className="subtitle">Professional Loan Calculation Portal</p>

      <div className="card">
        <h2 className="card-title">Enter Your Loan Details</h2>

        <input className="input" name="email" placeholder="Email" onChange={handleChange} />
        <input className="input" name="phone" placeholder="Contact Number" onChange={handleChange} />
        <input className="input" name="principal" placeholder="Loan Amount (₹)" onChange={handleChange} />
        <input className="input" name="annualInterestRate" placeholder="Annual Interest Rate (%)" onChange={handleChange} />
        <input className="input" name="tenureYears" placeholder="Tenure (Years)" onChange={handleChange} />

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Calculating..." : "Calculate EMI"}
        </button>
      </div>

      <h2 className="history-title">📜 Recent EMI Records</h2>

      {history.length === 0 ? (
        <p>No records found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Rate (%)</th>
              <th>Years</th>
              <th>EMI (₹)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row) => (
              <tr key={row.id}>
                <td>{row.email}</td>
                <td>{row.phone}</td>
                <td>{row.principal}</td>
                <td>{row.annualInterestRate}</td>
                <td>{row.tenureYears}</td>
                <td>{row.emiAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer className="footer">
        This container is created by <b>Vipin Kumar</b>
      </footer>
    </div>
  );
}

export default App;

