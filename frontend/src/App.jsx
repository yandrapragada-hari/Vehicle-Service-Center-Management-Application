import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import BookService from "./BookService";
import ViewBookings from "./ViewBookings";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book" element={<BookService />} />
        <Route path="/view" element={<ViewBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;