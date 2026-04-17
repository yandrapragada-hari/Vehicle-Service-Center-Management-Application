import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.message === 'Login successful') {
        const meRes = await fetch('http://localhost:4000/me', { credentials: 'include' });
        const meData = await meRes.json();
        
        if (meData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
                background: 'var(--accent-primary)', 
                width: '70px', 
                height: '70px', 
                borderRadius: '20px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                margin: '0 auto 20px',
                color: 'white',
                boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
            }}>
                <ShieldCheck size={36} />
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Service Protocol</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secure access to vehicle management systems.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={14} /> Username
            </label>
            <input
              type="text"
              className="premium-input"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} /> Password
            </label>
            <input
              type="password"
              className="premium-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', gap: '10px' }}>
            Initialize Access <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'var(--bg-slate)', border: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            <strong>Authorized Personnel Only</strong><br/>
            Admin: admin / password | User: customer1 / pass
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;