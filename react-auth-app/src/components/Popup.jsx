
// import React, { useState } from "react";

const Popup = ({ isOpen, onClose}) => {
const step1Requirements = [
  { label: "Complete FNA", type: "date", placeholder: "Date Completed" },
  { label: "Schedule appt to review wealth plan", type: "date", placeholder: "Date Completed" },
  { label: "Review wealth plan", type: "date", placeholder: "Date Completed" },
  { label: "Submit wealth plan apps", type: "date", placeholder: "Date Completed" },
  { label: "Complete agent agreement", type: "text", placeholder: "UW ID" },
  { label: "Bookmark Universal Wealth back office login site", type: "text", placeholder: "Username" },
  { label: "Bookmark agent resource website", type: "password", placeholder: "Password" },
  { label: "Set up XCEL study material", type: "text", placeholder: "Username" },
  { label: "Watch New Agent Orientation Video", type: "file", placeholder: "Upload confirmation screenshot" }
];

  if (!isOpen) return null; // Agar open nahi hai to kuch render na karo



  return (
  <div className="popup">
  <div className="popup-content">
    <h3>Step 1 Verification</h3>
    <div className="popup-body">
      {step1Requirements.map((req, index) => (
        <div key={index} className="form-group">
          <label>{req.label}</label>
          <input
            type={req.type}
            placeholder={req.placeholder}
          />
        </div>
      ))}
    </div>
    <div className="popup-actions">
      <button className="close-btn" onClick={onClose}>
        Cancel
      </button>
      <button className="save-btn" >
        Save
      </button>
    </div>
  </div>
</div>

  );
};

export default Popup;
