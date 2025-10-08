// src/components/Wizard.jsx
import React, { useState, useEffect } from "react";
import { fetchStepsData } from "../data/stepsData.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { getUserData,send_Email } from "../services/apiService.js";
import { sendUpdateToBackend,updateStepsData,buildFinalObject } from "../utils/wizardHelpers.js";
import Popup from "./Popup";
const Wizard = () => {
  const [stepsData, setStepsData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // popup ke liye state
  // Form data ko localStorage se load karo
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("wizardData");
    return savedData ? JSON.parse(savedData) : {};
  });

  // Form data ko localStorage me save karo
  useEffect(() => {
    localStorage.setItem("wizardData", JSON.stringify(formData));
  }, [formData]);

    // ✅ API se data fetch karna
    useEffect(() => {
      const loadSteps = async () => {
        const data = await fetchStepsData();
        setStepsData(data);
      };
      loadSteps();
    }, []);

  // ✅ Checkbox toggle handler (runtime par UI update ke sath)
  const handleCheckboxChange = (optionId) => {

    const currentStepKey = stepsData[currentStep].id;

    const prevSelected = formData[currentStepKey] || [];
    let updatedSelected;

    if (prevSelected.includes(optionId)) {
      // Agar pehle se selected hai to remove karo
      updatedSelected = prevSelected.filter(id => id !== optionId);
    } else {
      // Nahi selected hai to add karo
      updatedSelected = [...prevSelected, optionId];
    }

    // Local formData update
    setFormData({
      ...formData,
      [currentStepKey]: updatedSelected,
    });

    const updatedSteps = updateStepsData(stepsData, currentStep, optionId, prevSelected);
    setStepsData(updatedSteps);

    // Backend call karo (optional)
    sendUpdateToBackend(optionId, !prevSelected.includes(optionId));
  };



const nextStep = () => {

  setShowPopup(true); // ✅ popup open kar do
  if (currentStep < stepsData.length - 1) {
    getUserData(currentStep+1);
    setCurrentStep(prev => prev + 1);
    return;
  }

  const finalObject = buildFinalObject(stepsData, formData);
  send_Email();
  // Show & persist
  getUserData(currentStep+1)
  console.log("Final step-wise selections:", finalObject);
  localStorage.setItem("wizardFinalSelection", JSON.stringify(finalObject));

};



// ✅ Previous Step
const prevStep = () => {
  if (currentStep > 0) {
    setCurrentStep(prev => prev - 1);
  }
};

// ✅ Fixed isStepValid
const isStepValid = () => {
  if (stepsData.length === 0) return false;

  // Current step ke saare options check karo
  const currentStepOptions = stepsData[currentStep].options;

  // Agar koi bhi option completed nahi hai to false return karo
  return currentStepOptions.every(opt => opt.is_completed === 1);
};


  // ✅ Agar data loading me hai
  if (stepsData.length === 0) {
    return <p>Loading steps...</p>;
  }

  return (
    <div className="app">
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={stepsData.length} />

      {/* Current Step UI */}
      <div>
        <h3>{stepsData[currentStep].title}</h3>
        <ul>
          {stepsData[currentStep].options.map(option => (
            <li key={option.id}>
              <label>
                <input
                  type="checkbox"
                  checked={option.is_completed === 1}
                  onChange={() => handleCheckboxChange(option.id)}
                />
                 {option.link && option.link.trim() !== "" ? (
                  <a href={option.link} target="_blank">{option.label}</a>
                ) : (
                  <span>{option.label}</span>
                )}
                </label>
            </li>
          ))}
        </ul>
    <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <p>Please provide your study material details here...</p>
      </Popup>
      </div>

      {/* Navigation Buttons */}
      <div
  style={{
    display: "flex",
    justifyContent: currentStep !== 0 ? "space-between" : "flex-end",
    marginTop: "20px",
  }}
>
  {currentStep !== 0 && (
    <button onClick={prevStep}>
      Back
    </button>
  )}

  {isStepValid() && (
    <button className="primary" onClick={nextStep}>
      {currentStep === stepsData.length - 1 ? "Finish" : "Next"}
    </button>
  )}
</div>

    </div>
  );
};

export default Wizard;
