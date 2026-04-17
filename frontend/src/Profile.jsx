import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, ChevronLeft, Mail, Shield, Award, Edit3, Settings } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Not logged in') {
          navigate('/');
        } else {
          setUser(data);
        }
      })
      .catch(err => {
        console.log(err);
        navigate('/');
      });
  }, [navigate]);

  if (!user) return <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '100px' }}>Loading Profile...</div>;

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '10px', color: 'white' }}>
                    <Settings size={24} />
                </div>
                <h1>Member Profile</h1>
            </div>
            <Link to="/dashboard">
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChevronLeft size={18} /> Back to Dashboard
                </button>
            </Link>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'var(--accent-primary)', 
            borderRadius: '50%', 
            margin: '0 auto 30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)'
          }}>
            <User size={60} />
          </div>

          <h2 style={{ marginBottom: '8px' }}>{user.username}</h2>
          <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: 'var(--accent-primary)', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                fontSize: '0.75rem', 
                letterSpacing: '0.1em', 
                marginBottom: '40px',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px'
            }}>
            <Award size={14} />
            {user.role} Member
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', background: 'var(--bg-slate)', padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                    <Shield size={16} /> Account ID
                </div>
                <span style={{ fontWeight: '600' }}>#{user.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                    <Award size={16} /> Status
                </div>
                <span style={{ color: 'var(--accent-success)', fontWeight: '700' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                    <Mail size={16} /> Email
                </div>
                <span style={{ fontWeight: '500' }}>{user.username}@automotive.com</span>
            </div>
          </div>

          <button className="btn btn-outline" style={{ marginTop: '40px', width: '100%', gap: '10px' }} onClick={() => alert('Feature coming soon!')}>
            <Edit3 size={18} /> Edit Profile Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;