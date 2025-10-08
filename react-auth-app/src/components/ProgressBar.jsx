// src/components/ProgressBar.js
import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{
        height: "10px",
        background: "#1f2937",
        borderRadius: "5px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "10px",
          background: "#6366f1",
          transition: "width 0.3s ease"
        }} />
      </div>
      <p style={{ fontSize: "14px", marginTop: "5px", textAlign: "center" }}>
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
};

export default ProgressBar;
