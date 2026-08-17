const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let db;

// Initialize relational schema mapping structures
(async () => {
    try {
        db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                age TEXT, phone TEXT, gender TEXT, dob TEXT, nationality TEXT,
                address TEXT, city TEXT, state TEXT, zip TEXT, country TEXT,
                education TEXT, school TEXT, gradyear TEXT, occupation TEXT, experience TEXT,
                skill1 TEXT, skill2 TEXT, workmode TEXT, linkedin TEXT, github TEXT,
                salary TEXT, languages TEXT, source TEXT, hobbies TEXT, ice_name TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
        `);
        console.log("🚀 SQLite Database initialized with core tables!");
    } catch (err) {
        console.error("❌ CRITICAL DATABASE RE-MAPPING FAILURE:", err.message);
    }
})();

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
        if (password.length < 6) return res.status(400).json({ error: 'Password must be 6+ characters.' });

        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
        if (userExists) return res.status(400).json({ error: 'Email already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name.trim(), normalizedEmail, hashedPassword]);
        res.status(201).json({ message: 'Registration successful!' });
    } catch (e) {
        res.status(500).json({ error: 'Registration failed.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'All fields required.' });

        const user = await db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const profile = await db.get('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
        res.status(200).json({ name: user.name, has_profile: !!profile, profile: profile || null });
    } catch (e) {
        res.status(500).json({ error: 'Login broken.' });
    }
});

app.post('/api/save-profile', async (req, res) => {
    try {
        const data = req.body;
        const user = await db.get('SELECT id FROM users WHERE email = ?', [data.email.trim().toLowerCase()]);
        if (!user) return res.status(404).json({ error: "User identity trace lost." });

        await db.run(`
            INSERT INTO profiles (
                user_id, age, phone, gender, dob, nationality, address, city, state, zip, country,
                education, school, gradyear, occupation, experience, skill1, skill2, workmode, linkedin, github,
                salary, languages, source, hobbies, ice_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user.id, data.age, data.phone, data.gender, data.dob, data.nationality, data.address, data.city, data.state, data.zip, data.country,
            data.education, data.school, data.gradyear, data.occupation, data.experience, data.skill1, data.skill2, data.workmode, data.linkedin, data.github,
            data.salary, data.languages, data.source, data.hobbies, data.ice_name
        ]);
        res.status(201).json({ message: "Profile saved!" });
    } catch (e) {
        console.error("❌ BACKEND DATABASE CRASH DETAILS:", e.message);
        res.status(500).json({ error: `Database Error: ${e.message}` });
    }
});

// 🚨 SINGLE, CORRECT CLOUD-COMPATIBLE LISTENER MAPPED DYNAMICALLY
app.listen(process.env.PORT || 3000, () => console.log('🟢 Backend Server live'));
