import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  LogOut, 
  PlusCircle, 
  History, 
  CheckCircle2, 
  Clock, 
  Activity,
  ArrowRightCircle,
  Hash,
  User,
  Car,
  Settings
} from "lucide-react";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total_orders: 0, pending_orders: 0, completed_orders: 0 });
  const [audits, setAudits] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const urls = [
        "http://localhost:4000/orders",
        "http://localhost:4000/stats",
        "http://localhost:4000/audits"
      ];
      
      const [ordersRes, statsRes, auditsRes] = await Promise.all(
        urls.map(url => fetch(url, { credentials: "include" }))
      );

      if (ordersRes.status === 401) {
        navigate("/");
        return;
      }

      const ordersData = await ordersRes.json();
      const statsData = await statsRes.json();
      const auditsData = await auditsRes.json();

      setOrders(ordersData);
      setStats(statsData);
      setAudits(auditsData);
    } catch (err) {
      console.log("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page-container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "var(--accent-primary)", padding: "12px", borderRadius: "12px", color: "white" }}>
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, background: "linear-gradient(to right, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Command Center</h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "0.9rem" }}>Real-time service management and database monitoring.</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/dashboard"><button className="btn btn-outline">User View</button></Link>
            <button
                onClick={() => fetch("http://localhost:4000/logout", { method: "POST", credentials: "include" }).then(() => navigate("/"))}
                className="btn btn-danger"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
      </header>

      {/* Aggregate Stats Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div className="glass-card" style={{ padding: "24px", borderLeft: "4px solid var(--accent-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Volume</p>
            <div style={{ fontSize: "2.5rem", fontWeight: "800", marginTop: "8px" }}>{stats.total_orders || 0}</div>
          </div>
          <div style={{ color: "var(--accent-primary)", opacity: 0.5 }}><History size={48} /></div>
        </div>
        <div className="glass-card" style={{ padding: "24px", borderLeft: "4px solid var(--accent-warning)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Queue</p>
            <div style={{ fontSize: "2.5rem", fontWeight: "800", marginTop: "8px", color: "var(--accent-warning)" }}>{stats.pending_orders || 0}</div>
          </div>
          <div style={{ color: "var(--accent-warning)", opacity: 0.5 }}><Clock size={48} /></div>
        </div>
        <div className="glass-card" style={{ padding: "24px", borderLeft: "4px solid var(--accent-success)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Finished</p>
            <div style={{ fontSize: "2.5rem", fontWeight: "800", marginTop: "8px", color: "var(--accent-success)" }}>{stats.completed_orders || 0}</div>
          </div>
          <div style={{ color: "var(--accent-success)", opacity: 0.5 }}><CheckCircle2 size={48} /></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "30px", alignItems: "start" }}>
        {/* Main Orders Table */}
        <section className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <Settings size={20} className="text-secondary" />
              Active Job Management
            </h3>
          </div>
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Hash size={14} /> Order</div></th>
                  <th><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><User size={14} /> Customer</div></th>
                  <th><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Car size={14} /> Vehicle</div></th>
                  <th>Service Details</th>
                  <th>Status Control</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr key={item.order_id}>
                    <td style={{ fontWeight: "700", color: "var(--accent-primary)" }}>#{item.order_id}</td>
                    <td>
                      <div style={{ fontWeight: "600" }}>{item.customer_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>@{item.username || "guest"}</div>
                    </td>
                    <td>{item.vehicle_number}</td>
                    <td><span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{item.service_type}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <select
                          value={item.status || "Pending"}
                          onChange={(e) => handleStatusChange(item.order_id, e.target.value)}
                          className="premium-input"
                          style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <ArrowRightCircle size={16} style={{ opacity: 0.3 }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Audit Log / Trigger Feedback */}
        <section className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} style={{ color: "var(--accent-primary)" }} />
            Live Monitor (Triggers)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {audits.map((audit) => (
              <div key={audit.audit_id} style={{ paddingBottom: "16px", borderBottom: "1px solid var(--glass-border)", fontSize: "0.8rem" }}>
                <div style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "800", color: "var(--text-primary)" }}>Req #{audit.order_id}</span> update detected
                </div>
                <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ opacity: 0.6 }}>{audit.old_status}</span> 
                    <ArrowRightCircle size={12} style={{ color: "var(--accent-primary)" }} />
                    <span style={{ color: "var(--accent-success)", fontWeight: "700" }}>{audit.new_status}</span>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                  {new Date(audit.changed_at).toLocaleTimeString()} • {new Date(audit.changed_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {audits.length === 0 && <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Waiting for state changes...</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
