import React, { useState } from "react";
import {modify_user_basic_details,changeUserPassword} from "../services/apiService.js";
export default function Profile({ user }) {
  const [formData, setFormData] = useState({
    username: user?.name || "",
    firstname: user?.first_name || "",
    lastname: user?.last_name || "",
    currentPassword: "",
    newPassword: ""
  });

  // Track which field is editable
  const [editableField, setEditableField] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (actionName) => {
     if (['username', 'firstname', 'lastname'].includes(actionName)) {
        const fieldMap = {
          username: 'user_name',
          firstname: 'first_name',
          lastname: 'last_name'
        };

        const apiKey = fieldMap[actionName];
        const value = formData[actionName];

        modify_user_basic_details({ [apiKey]: value }).then(response => {
          if(response.success){
            // alert('User details updated successfully');
            setEditableField(null);
          }

      });
    }

  };

  async function validatePasswordChange() {
   const response = await changeUserPassword(formData.currentPassword, formData.newPassword);
      if (response.success) {
        setAlert({ type: "success", message: response.message });
      }
      if (response.error) {
        setAlert({ type: "danger", message: response.message });
      }
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  }

return (
  <div className="container my-5">
    <div className="card shadow-lg p-4 border-0 rounded-4">
      <h2 className="mb-4 text-center text-primary fw-bold">User Profile</h2>
     {/* Flash Message */}
      {alert.message && (
        <div className={`alert alert-${alert.type} mt-3`} role="alert">
          {alert.message}
        </div>
      )}
      {/* User Details Section */}
      <div className="mb-5">
        {["username", "firstname", "lastname"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="form-label fw-semibold text-secondary">
              {field === "username"
                ? "Username"
                : field === "firstname"
                ? "First Name"
                : "Last Name"}
            </label>
            <div className="input-group">
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-control form-control-lg shadow-sm"
                disabled={editableField !== field}
              />
              <button
                className={`btn ${
                  editableField === field ? "btn-success" : "btn-outline-primary"
                } px-4`}
                onClick={() =>
                  editableField === field
                    ? handleSave(field)
                    : setEditableField(field)
                }
              >
                {editableField === field ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Password Change Section */}
      <div className="border-top pt-4">
        <h4 className="text-secondary mb-3">Change Password</h4>
        <div className="row g-3 align-items-end">
          {/* Current Password */}
          <div className="col-md-4">
            <label htmlFor="currentPassword" className="form-label fw-semibold">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div className="col-md-4">
            <label htmlFor="newPassword" className="form-label fw-semibold">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter new password"
            />
          </div>

          {/* Save Button */}
          <div className="col-md-4 d-grid">
            <button
              type="button"
              className="btn btn-primary btn-lg shadow-sm fw-semibold"
              onClick={() => validatePasswordChange()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
