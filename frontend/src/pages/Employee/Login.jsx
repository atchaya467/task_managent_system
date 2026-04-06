import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useToast } from '../../components/Toast';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.role === 'employee') {
        if (!data.isApproved) {
          showToast('Account pending. Please wait for Admin approval.', 'error');
        } else {
          showToast('🔓 Portal Access Granted!');
          localStorage.setItem('userInfo', JSON.stringify(data));
          setTimeout(() => navigate('/employee/dashboard'), 800);
        }
      } else {
        showToast(data.message || 'Access Denied: Invalid Credentials', 'error');
      }
    } catch (err) {
      showToast('Server connection failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ToastContainer />
      <div style={{ position: 'absolute', top: 30, left: 30 }}>
        <Link to="/" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none' }}>
          <ArrowLeft size={18} /> Back to Gateway
        </Link>
      </div>
      
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--accent-purple)' }}>Employee Access</h2>
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', zIndex: 10 }}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-secondary" style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} disabled={isLoading}>
            {isLoading ? <span className="loader"></span> : 'Secure Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/employee/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
