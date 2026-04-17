import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarPlus, History, User, LogOut, ArrowRight, ClipboardList } from "lucide-react";
import BookingTable from "./components/BookingTable";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const userRes = await fetch('http://localhost:4000/me', { credentials: 'include' });
        const userData = await userRes.json();
        
        if (userData.message === 'Not logged in') {
          navigate('/');
          return;
        }
        setUser(userData);

        const bookingsRes = await fetch('http://localhost:4000/book', { credentials: 'include' });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [navigate]);

  const handleLogout = () => {
    fetch('http://localhost:4000/logout', { method: 'POST', credentials: 'include' })
      .then(() => navigate('/'));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)' }}>Initializing Experience...</div>;

  return (
    <div className="page-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', background: "linear-gradient(to right, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Vehicle Service Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back, <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{user.username}</span></p>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      <section style={{ marginBottom: '50px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={20} className="text-secondary" /> Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {/* Action Card 1 */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', transition: 'var(--transition)', padding: '24px' }}>
            <div style={{ color: 'var(--accent-primary)' }}>
                <CalendarPlus size={32} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.1rem' }}>Book Service</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>Schedule your next vehicle maintenance or repair.</p>
            </div>
            <Link to="/book" style={{ marginTop: 'auto' }}>
                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>New Appointment</button>
            </Link>
            </div>

            {/* Action Card 2 */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', transition: 'var(--transition)', padding: '24px' }}>
            <div style={{ color: 'var(--accent-secondary)' }}>
                <History size={32} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.1rem' }}>My History</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>Review past services and track active requests.</p>
            </div>
            <Link to="/view" style={{ marginTop: 'auto' }}>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>View Full Records</button>
            </Link>
            </div>

            {/* Action Card 3 */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', transition: 'var(--transition)', padding: '24px' }}>
            <div style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
                <User size={32} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.1rem' }}>Profile</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>Manage your account and contact details.</p>
            </div>
            <Link to="/profile" style={{ marginTop: 'auto' }}>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>Account Settings</button>
            </Link>
            </div>
        </div>
      </section>

      {/* New Live Feed Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <History size={20} className="text-secondary" /> Recent Service Activity
            </h3>
            {bookings.length > 0 && (
                <Link to="/view" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    See all history <ArrowRight size={14} />
                </Link>
            )}
        </div>
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <BookingTable data={bookings} limit={5} />
        </div>
      </section>

      <footer style={{ marginTop: '100px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', padding: '40px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 Vehicle Service Center Management. Premium Dashboard v2.1</p>
      </footer>
    </div>
  );
}

export default Dashboard;