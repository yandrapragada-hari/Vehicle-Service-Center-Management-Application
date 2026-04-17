import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, ChevronLeft, Send, User, Car, Calendar, ClipboardList } from "lucide-react";

function BookService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    vehicle: "",
    service: "",
    date: "",
    problem: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    if (res.ok) {
        alert("Booking request submitted successfully!");
        navigate('/view');
    } else {
        alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '10px', color: 'white' }}>
            <Wrench size={24} />
          </div>
          <div>
            <h1>Book a Service</h1>
            <p style={{ color: "var(--text-secondary)" }}>Enter your vehicle details to schedule an appointment.</p>
          </div>
        </div>
        <Link to="/dashboard">
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form className="glass-card" style={{ width: '100%', maxWidth: '600px' }} onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} /> Customer Name
                </label>
                <input name="name" className="premium-input" placeholder="Full Name" onChange={handleChange} required />
            </div>

            <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Car size={14} /> Vehicle Number
                </label>
                <input name="vehicle" className="premium-input" placeholder="e.g. AP07DY2374" onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
                <label className="input-label">Service Type</label>
                <select name="service" className="premium-input" onChange={handleChange} required>
                    <option value="">Select Service</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="General Service">General Service</option>
                    <option value="Repair">Specialized Repair</option>
                    <option value="Battery Check">Battery Check</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} /> Preferred Date
                </label>
                <input type="date" name="date" className="premium-input" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Problem Description</label>
            <textarea 
                name="problem" 
                className="premium-input" 
                placeholder="Describe the issues you are experiencing..." 
                rows="4"
                style={{ resize: 'none' }}
                onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', gap: '10px' }}>
            Confirm Booking Request <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookService;