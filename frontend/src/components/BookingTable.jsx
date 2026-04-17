import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Wrench, Calendar, Hash, Timer } from 'lucide-react';

const BookingTable = ({ data, limit }) => {
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return <span className="badge badge-completed">Completed</span>;
    if (s === 'in progress') return <span className="badge badge-progress">In Progress</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  const displayData = limit ? data.slice(0, limit) : data;

  return (
    <div className="premium-table-wrapper">
      <table className="premium-table">
        <thead>
          <tr>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Hash size={14} /> ID</div></th>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Car size={14} /> Vehicle</div></th>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Wrench size={14} /> Service</div></th>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> Date</div></th>
            <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Timer size={14} /> Status</div></th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item) => (
            <tr key={item.order_id}>
              <td style={{ fontWeight: "600", color: "var(--accent-primary)" }}>#{item.order_id}</td>
              <td>{item.vehicle_number}</td>
              <td>
                <div style={{ fontWeight: "600" }}>{item.service_type}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{item.problem_description}</div>
              </td>
              <td>
                <div style={{ color: "var(--text-primary)" }}>{new Date(item.service_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
              </td>
              <td>{getStatusBadge(item.status)}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "15px", color: 'var(--accent-primary)', opacity: 0.3 }}>
                    <Car size={50} style={{ margin: '0 auto' }} />
                </div>
                No bookings found. <Link to="/book" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Schedule your first service now.</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
