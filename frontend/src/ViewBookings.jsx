import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { History, ChevronLeft } from "lucide-react";
import BookingTable from "./components/BookingTable";

function ViewBookings() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:4000/book", { credentials: 'include' });
            if (res.status === 401) {
              navigate('/');
              return;
            }
            const bookingsData = await res.json();
            setData(bookingsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '100px' }}>Loading Records...</div>;

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'var(--accent-secondary)', padding: '10px', borderRadius: '10px', color: 'white' }}>
                <History size={24} />
            </div>
            <div>
              <h1>Service History</h1>
              <p style={{ color: "var(--text-secondary)" }}>Track the progress and history of your service appointments.</p>
            </div>
        </div>
        <Link to="/dashboard">
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <BookingTable data={data} />
      </div>
    </div>
  );
}

export default ViewBookings;