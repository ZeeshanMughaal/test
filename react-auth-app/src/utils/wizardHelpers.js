import { updateTrainingProgress} from "../services/apiService.js";
// ✅ Backend ko update karna
  export const sendUpdateToBackend = async (optionId, newStatus) => {
    updateTrainingProgress(optionId,newStatus);
  };


// utils/updateStepsData.js

/**
 * Update stepsData when option is toggled
 * @param {Array} stepsData - current steps data
 * @param {number} currentStep - index of active step
 * @param {string|number} optionId - selected option id
 * @param {Array} prevSelected - already selected options
 * @returns {Array} updated stepsData
 */
export const updateStepsData = (stepsData, currentStep, optionId, prevSelected) => {
  return stepsData.map((step, stepIndex) => {
    if (stepIndex === currentStep) {
      return {
        ...step,
        options: step.options.map(opt =>
          opt.id === optionId
            ? { ...opt, is_completed: prevSelected.includes(optionId) ? 0 : 1 }
            : opt
        ),
      };
    }
    return step;
  });
};




// utils/buildFinalObject.js
export const buildFinalObject = (stepsData, formData) => {
  return stepsData.reduce((acc, step) => {
    const stepKey = step.id;

    const formSelected = new Set(formData[stepKey] || []);
    const completed = new Set(step.options.filter(o => o.is_completed === 1).map(o => o.id));
    const union = new Set([...formSelected, ...completed]);

    // Preserve original option order
    const ordered = step.options.map(o => o.id).filter(id => union.has(id));

    acc[stepKey] = ordered;
    return acc;
  }, {});
};
