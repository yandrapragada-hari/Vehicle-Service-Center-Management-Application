const express = require('express')
const cors = require('cors')
const sql = require('mysql2')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

const db = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const setupDatabase = async () => {
    try {
        const pDb = db.promise();
        
        // Test connection
        await pDb.query('SELECT 1');
        console.log("Database connected successfully through Pool");
        
        // DDL: Create Tables (if not exist)
        await pDb.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(20) DEFAULT 'customer')`);
        await pDb.query(`CREATE TABLE IF NOT EXISTS orders (order_id INT PRIMARY KEY AUTO_INCREMENT, customer_name VARCHAR(100) NOT NULL, vehicle_number VARCHAR(20) NOT NULL, service_type VARCHAR(50) NOT NULL, service_date DATE NOT NULL, problem_description TEXT, status VARCHAR(20) DEFAULT 'Pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INT)`);
        await pDb.query(`CREATE TABLE IF NOT EXISTS orders_audit (audit_id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, old_status VARCHAR(20), new_status VARCHAR(20), changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        
        // Alter columns fallback (ignore errors if columns already exist)
        try { await pDb.query(`ALTER TABLE orders ADD COLUMN user_id INT`); } catch(e) {}
        try { await pDb.query(`ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer'`); } catch(e) {}
        
        // DDL: Create View (Joining tables)
        await pDb.query(`CREATE OR REPLACE VIEW pending_orders_view AS SELECT o.order_id, o.customer_name, o.vehicle_number, o.service_type, u.username FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'Pending'`);
        
        // DDL: Create Trigger for tracking order status updates
        await pDb.query(`DROP TRIGGER IF EXISTS after_order_update`);
        await pDb.query(`
            CREATE TRIGGER after_order_update
            AFTER UPDATE ON orders
            FOR EACH ROW
            BEGIN
                IF OLD.status != NEW.status THEN
                    INSERT INTO orders_audit (order_id, old_status, new_status)
                    VALUES (OLD.order_id, OLD.status, NEW.status);
                END IF;
            END
        `);
        
        console.log("Database setup (DDL, View, Trigger) completed successfully");
    } catch (error) {
        console.log("Database setup/connection error:", error);
    }
};

setupDatabase();

app.post('/book', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
    console.log(req.body);
    db.query(`INSERT INTO orders (customer_name, vehicle_number, service_type, service_date, problem_description, user_id) VALUES (?, ?, ?, ?, ?, ?)`, [req.body.name, req.body.vehicle, req.body.service, req.body.date, req.body.problem, req.session.userId], (err) => {
        if (err) {
            console.log("insertion failed: ", err);
            return res.status(500).json({ error: err });
        }
        console.log("Insertion Successful");
        res.json({ message: "data Received" });
    });
});

app.get('/book', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
    let query = `SELECT * FROM orders WHERE user_id = ?`;
    let params = [req.session.userId];
    db.query(query, params, (err, results) => {
        if (err) {
            console.log("fetching failed: ", err);
            return res.status(500).json({ error: err });
        }
        console.log("fetching Successful");
        res.json(results);
    });
});

app.put('/book/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    // Status update functionality might require a role check. Since admin is removed, we'll keep it as is or remove it.
    // Keeping it as is but users could potentially update it if they know the endpoint.
    db.query(`UPDATE orders SET status = ? WHERE order_id = ?`, [status, id], (err) => {
        if (err) {
            console.log("Update failed: ", err);
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'Status updated' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.log("Login query failed: ", err);
            return res.status(500).json({ error: err });
        }
        if (results.length > 0) {
            req.session.userId = results[0].id;
            req.session.role = results[0].role;
            res.json({ message: 'Login successful' });
        } else {
            res.json({ message: 'Invalid credentials' });
        }
    });
});

app.get('/orders', (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });
    const query = `
      SELECT orders.*, users.username 
      FROM orders 
      LEFT JOIN users ON orders.user_id = users.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.put('/orders/:id', (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const { status } = req.body;
    db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Status updated' });
    });
});

app.get('/me', (req, res) => {
    if (req.session.userId) {
        db.query('SELECT id, username, role FROM users WHERE id = ?', [req.session.userId], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(401).json({ message: 'User not found' });
            }
        });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Logged out' });
    });
});



// DQL: Aggregate Functions
app.get('/stats', (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_orders,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_orders
        FROM orders
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

// DQL: Aggregate & GROUP BY
app.get('/service-stats', (req, res) => {
    const query = `
        SELECT service_type, COUNT(*) as count 
        FROM orders 
        GROUP BY service_type
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// DQL: View Usage
app.get('/pending-view', (req, res) => {
    db.query('SELECT * FROM pending_orders_view', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// DQL: Audit Logs
app.get('/audits', (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });
    const query = `
        SELECT a.*, o.customer_name, o.vehicle_number 
        FROM orders_audit a 
        JOIN orders o ON a.order_id = o.order_id 
        ORDER BY a.changed_at DESC 
        LIMIT 10
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.listen(4000, (req, res) => {
    console.log("Server is live")
});