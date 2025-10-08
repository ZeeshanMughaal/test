"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import CryptoJS from "crypto-js";

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.username.trim()) return "Username is required."
    if (!form.password) return "Password is required."
    return ""
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    setLoading(true)
    setError("")
    const hashedPassword = CryptoJS.MD5(form.password).toString();
    console.log("Hashed Password:", hashedPassword); // Debugging line to check the hashed password
    try {
      // Prepare the rest_data as JSON string matching your Postman setup
      const restData = {
        user_auth: {
          user_name: form.username,
          password: hashedPassword,
          application_name: "test",
          name_value_list: [],
        },
      }

      // Prepare form data for x-www-form-urlencoded
      const formData = new URLSearchParams()
      formData.append("method", "login")
      formData.append("input_type", "JSON")
      formData.append("response_type", "JSON")
      formData.append("rest_data", JSON.stringify(restData))

      const response = await fetch("http://localhost/SuiteCRM-7.10.33/service/v4_1/rest.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Login Response:", result) // Debugging line to check the API response
      if (result.id) {
        const userData = {
          id: result.name_value_list.user_id.value,
          name: result.name_value_list.user_name.value,
          first_name: result.name_value_list.first_name.value,
          last_name: result.name_value_list.last_name.value,
          email: form.username.trim().toLowerCase(), // API me email nahi hai to username use kar rahe hain
          session_id: result.id,
        }


      localStorage.setItem("demo_current_user", JSON.stringify(userData))

  // ✅ dashboard par navigate karo
      navigate("/dashboard")
      } else if (result.name === "Invalid Login") {
        setError("Invalid username or password.")
      } else {
        setError(result.description || "Login failed. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            disabled={loading}
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="muted">
        New here? <Link to="/register">Create an account</Link>
      </div>
    </div>
  )
}
