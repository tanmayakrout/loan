import React, { useEffect, useState } from "react";
import api from "../api";

const LoanHistory = ({ latest }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/loan/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (latest) {
      fetchHistory();
    }
  }, [latest]);

  return (
    <div className="loan-history">
      <h3>Recent EMI Calculations</h3>
      {loading && <p>Loading...</p>}
      {!loading && history.length === 0 && <p>No records found.</p>}
      {!loading && history.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Principal (₹)</th>
              <th>Rate (%)</th>
              <th>Tenure (Years)</th>
              <th>EMI (₹)</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>{h.email}</td>
                <td>{h.phone}</td>
                <td>{h.principal}</td>
                <td>{h.annualInterestRate}</td>
                <td>{h.tenureYears}</td>
                <td>{h.emiAmount}</td>
                <td>{new Date(h.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanHistory;

