import { Link } from "react-router-dom";
import { LogIn, Calendar, ClipboardList, Car } from "lucide-react";

function Home() {
  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '60px' }}>
        <div style={{ background: 'var(--accent-primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px', color: 'white' }}>
            <Car size={40} />
        </div>
        <h1 style={{ marginBottom: '15px' }}>Vehicle Service Center</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Your premium partner for automotive excellence and management.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link to="/login">
                <button className="btn btn-primary" style={{ width: '100%', gap: '10px' }}>
                    <LogIn size={18} /> Initialize Session
                </button>
            </Link>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <Link to="/book">
                    <button className="btn btn-outline" style={{ width: '100%', gap: '10px' }}>
                        <Calendar size={18} /> Booking
                    </button>
                </Link>
                <Link to="/view">
                    <button className="btn btn-outline" style={{ width: '100%', gap: '10px' }}>
                        <ClipboardList size={18} /> Records
                    </button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Home;