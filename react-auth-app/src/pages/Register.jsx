import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Enter a valid email.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    try {
      registerUser({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  }

  return (
    <div className="card">
      <h2>Create account</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" />
        </label>

        <label>
          Confirm password
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat password" />
        </label>

        <button type="submit" className="primary">Sign up</button>
      </form>

      <div className="muted">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}