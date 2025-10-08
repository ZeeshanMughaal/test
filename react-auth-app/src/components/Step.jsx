import React from "react";

const Step = ({ stepData, formData, setFormData }) => {

  // ✅ Checkbox change handler
  const handleCheckboxChange = (optionId) => {
    const currentStepKey = stepData.id;

    // Pehle ka selected data
    const prevSelected = formData[currentStepKey] || [];

    let updatedSelected;
    if (prevSelected.includes(optionId)) {
      // Agar pehle se selected hai to remove karo
      updatedSelected = prevSelected.filter(id => id !== optionId);
    } else {
      // Nahi selected hai to add karo
      updatedSelected = [...prevSelected, optionId];
    }

    // ✅ Local state update karo
    setFormData({
      ...formData,
      [currentStepKey]: updatedSelected,
    });

    // ✅ Runtime par stepsData update karo (checkbox UI update ke liye)
    stepData.options = stepData.options.map(opt =>
      opt.id === optionId ? { ...opt, is_completed: prevSelected.includes(optionId) ? 0 : 1 } : opt
    );

    // ✅ Backend request yahan bhejo
    sendUpdateToBackend(optionId, !prevSelected.includes(optionId));
  };

  const sendUpdateToBackend = async (optionId, newStatus) => {
    try {
      const response = await fetch(`/api/update-checkbox`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: optionId,
          is_completed: newStatus ? 1 : 0,
        }),
      });

      const result = await response.json();
      console.log("Backend updated:", result);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };

  return (
    <div>
      <h3>{stepData.title}</h3>
      <ul>
        {stepData.options.map(option => (
          <li key={option.id}>
            <label>
              <input
                type="checkbox"
                checked={option.is_completed === 1}
                onChange={() => handleCheckboxChange(option.id)}
              />
              {option.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Step;
