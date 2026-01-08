import React, { useState } from "react";
import LoanForm from "./components/LoanForm";
import LoanHistory from "./components/LoanHistory";

const App = () => {
  const [latestResult, setLatestResult] = useState(null);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1>Home Loan EMI Portal</h1>
      <p>
        Enter your details to calculate EMI. Your email and contact number will
        be stored for future communication.
      </p>

      <LoanForm onResult={setLatestResult} />

      {latestResult && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}
        >
          <h3>Latest EMI Result</h3>
          <p>
            <strong>EMI Amount: </strong>₹ {latestResult.emiAmount.toLocaleString("en-IN")}
          </p>
          <p>
            <strong>Email:</strong> {latestResult.email}
          </p>
          <p>
            <strong>Phone:</strong> {latestResult.phone}
          </p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <LoanHistory latest={latestResult} />
      </div>
    </div>
  );
};

export default App;

