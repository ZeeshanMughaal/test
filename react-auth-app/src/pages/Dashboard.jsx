import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/auth';
import Wizard from "../components/Wizard.jsx";
import Profile from "../components/Profile.jsx";
import { getUserData } from '../services/apiService'; // ✅ import added

export default function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  async function handleShowProfile() {
    try {
      const response = await getUserData(); // ✅ backend request
      if (response?.status === 'success' && response?.data) {
        console.log("User Data:", response.data);
        setUser(response.data); // ✅ updated user data
      }
      setShowProfile(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  function handleLogout() {
    logoutUser();
    navigate('/login', { replace: true });
  }

return (
    <div className="col-lg-12">
      {!showProfile ? (
        <>
          <h2>Dashboard</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0 }}>
                Welcome{user?.name ? `, ${user.name}` : ''}!
              </p>
              <button onClick={handleShowProfile}>Profile</button>
            </div>
          <Wizard />
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Profile user={user} />
          <button onClick={() => setShowProfile(false)}>Back to Dashboard</button>
        </>
      )}
    </div>
  );
}