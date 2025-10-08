// src/services/apiService.js

// ✅ Helper function to send checkbox update to backend
export const updateTrainingProgress = async (id, isChecked) => {
  try {
    // Session data
    const restData = {
      session: "5tsmp37s80vfj99ath8tm87abo",
    };

    // User ID from localStorage
    const user = JSON.parse(localStorage.getItem("demo_current_user"));
    const userId = user?.id;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("method", "training_process_entry");
    formData.append("input_type", "JSON");
    formData.append("response_type", "JSON");
    formData.append("question_id", id);
    formData.append("user_id", userId);
    formData.append("is_completed", isChecked ? 1 : 0);
    formData.append("rest_data", JSON.stringify(restData));

    // API call
    const response = await fetch(
      "http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Backend Response:", data);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ✅ Get Question Bank
export const getQuestionBank = async () => {
  const restData = { session: "5tsmp37s80vfj99ath8tm87abo" };
  const user = JSON.parse(localStorage.getItem("demo_current_user"));
  const userId = user?.id;

  const formData2 = new URLSearchParams();
  formData2.append("method", "get_question_bank");
  formData2.append("input_type", "JSON");
  formData2.append("response_type", "JSON");
  formData2.append("user_id", userId);
  formData2.append("rest_data", JSON.stringify(restData));

  const response = await fetch("http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData2,
  });

  return response.json(); // return full JSON response
};

export const getUserData = async (current_step) => {
  try {
    // Session data
    const restData = {
      session: "5tsmp37s80vfj99ath8tm87abo",
    };
    const user = JSON.parse(localStorage.getItem("demo_current_user"));
    const userId = user?.id;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("method", "get_user_data");
    formData.append("input_type", "JSON");
    formData.append("response_type", "JSON");
    formData.append("user_id", userId);
     // ✅ current_step tabhi add hoga jab available ho
    if (current_step !== undefined && current_step !== null && current_step !== "") {
      formData.append("current_step", current_step);
    }
    formData.append(
      "rest_data",
      JSON.stringify({
        session: restData.session,
      })
    );

    // API call
    const response = await fetch(
      "http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
        },
        body: formData,
      }
    );

    const data = await response.json();


    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


export const loginUser = async (username, password) => {
  try {
    // Request data
    const restData = {
      user_auth: {
        user_name: username.trim().toLowerCase(),
        password: password,
        application_name: "custom_app",
        name_value_list: [],
      },
    };

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("method", "login"); // SuiteCRM custom login method
    formData.append("input_type", "JSON");
    formData.append("response_type", "JSON");
    formData.append("rest_data", JSON.stringify(restData));

    // API call
    const response = await fetch(
      "http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ✅ Agar login successful hai
    if (result.id) {
      const userData = {
        id: result.name_value_list.user_id.value,
        name: result.name_value_list.user_name.value,
        email: username.trim().toLowerCase(), // Agar email API me nahi hai to username use karein
        session_id: result.id, // Session ID store karein
      };

      // Local storage me save karein
      localStorage.setItem("demo_current_user", JSON.stringify(userData));

      console.log("Login Successful:", userData);

      return {
        success: true,
        data: userData,
      };
    }

    // ❌ Agar invalid credentials hain
    if (result.name === "Invalid Login") {
      return {
        success: false,
        message: "Invalid username or password.",
      };
    }

    // ❌ Agar koi aur error ho
    return {
      success: false,
      message: result.description || "Login failed. Please try again.",
    };
  } catch (error) {
    console.error("Login API Error:", error);
    return {
      success: false,
      message: error.message || "Network error. Please check your connection.",
    };
  }
};


export const send_Email = async () => {
  try {
    // Agar login ke baad session_id localStorage me hai to use karo
    const currentUser = JSON.parse(localStorage.getItem("demo_current_user"));
    const sessionId = currentUser?.session_id;

    if (!sessionId) {
      console.error("Session ID missing!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("demo_current_user"));
    const userId = user?.id;

    // SuiteCRM rest_data JSON structure
    const restData = {
      session: sessionId,
      user_id: userId,
    };

    // Prepare form data for SuiteCRM REST
    const formData = new URLSearchParams();
    formData.append("method", "send_Email"); // ✅ Custom method ka naam
    formData.append("input_type", "JSON");
    formData.append("response_type", "JSON");
    formData.append("user_id", userId);
    formData.append("rest_data", JSON.stringify(restData));

    // Fetch request
    const response = await fetch("http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    // JSON response parse karo
    const result = await response.json();
    console.log("API Response:", result);

    if (result.status === "success") {
      alert("Email sent successfully!");
    } else {
      alert("Email sending failed: " + (result.message || "Unknown error"));
    }

  } catch (error) {
    console.error("API Error:", error);
    alert("Network error occurred!");
  }
}


export const modify_user_basic_details = async (parameter) => {
  try {
    // Agar login ke baad session_id localStorage me hai to use karo
    const currentUser = JSON.parse(localStorage.getItem("demo_current_user"));
    const sessionId = currentUser?.session_id;

    if (!sessionId) {
      console.error("Session ID missing!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("demo_current_user"));
    const userId = user?.id;

    // SuiteCRM rest_data JSON structure

    // Prepare form data for SuiteCRM REST
    const formData = new URLSearchParams();
    formData.append("method", "modify_user_basic_details"); // ✅ Custom method ka naam
    formData.append("input_type", "JSON");
    formData.append("response_type", "JSON");
    formData.append("user_id", userId);
    formData.append("parameter", JSON.stringify(parameter));


    // Fetch request
    const response = await fetch("http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    // JSON response parse karo
    // console.log(response);
    const result = await response.json();
    return result;
    // console.log("API Response:", result);


  } catch (error) {
    console.error("API Error:", error);
    alert("Network error occurred!");
  }
}



export const changeUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = JSON.parse(localStorage.getItem("demo_current_user"));
    const userId = user?.id;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return { status: "error", message: "User not logged in" };
    }

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("method", "change_user_password");
    formData.append("input_type", "JSON");
    formData.append("response_type", "JSON");
    formData.append("user_id", userId);
    formData.append("current_password", currentPassword);
    formData.append("new_password", newPassword);

    // Send request
    const response = await fetch("http://localhost/SuiteCRM-7.10.33/service/v4_1_custom/rest.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Password change failed:", error);
    return { status: "error", message: "Request failed" };
  }
};
