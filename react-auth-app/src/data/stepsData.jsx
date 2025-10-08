// C:\Users\computer\Desktop\test\react-auth-app\src\data\stepsData.jsx
import { getQuestionBank } from "../services/apiService.js";

// ✅ Yeh function steps data dynamically load karega
export const fetchStepsData = async () => {
  const stepsData = [
    {
      id: "step1",
      title: "Step 1 - Onboarding Checklist",
      options: [],
    },
    {
      id: "step2",
      title: "Step 2 - Schedule State Exam",
      options: [],
    },
    {
      id: "step3",
      title: "Step 3 - Pass State Exam & Licensing",
      options: [],
    },
    {
      id: "step4",
      title: "Step 4 - Continuing Education & Compliance",
      options: [],
    },
    {
      id: "step5",
      title: "Step 5 - Get Contracted with Direct Carriers (Universal Wealth SureLC)",
      options: [],
    },
    {
      id: "step6",
      title: "Step 6 - Get Contracted with Quantum Carriers (Quantum SureLC)",
      options: [],
    },
    {
      id: "step7",
      title: "Step 7 - Complete Annuity Product Training",
      options: [],
    },
    {
      id: "step8",
      title: "Step 8 - Read Recommended Books",
      options: [],
    },
  ];

  try {
    const response = await getQuestionBank();

    if (Array.isArray(response.data)) {
      response.data.forEach((item) => {
        stepsData[item.step_number - 1].options.push({
          id: item.id,
          label: item.title,
          is_completed: Number(item.is_completed),
          link:item.link
        });
      });

      return stepsData;
    } else {
      console.error("Unexpected data format:", response.data);
      return stepsData;
    }
  } catch (error) {
    console.error("Error loading steps data:", error);
    return stepsData;
  }
};
