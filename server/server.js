import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

//make .env variables available through process.env.
dotenv.config();

const { Pool } = pkg;

//create app
const app = express();

//add middleware (runs before route handlers)
app.use(cors());
app.use(express.json()); //makes incoming JSON available through req.body

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

//connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log(`Connected to PostgreSQL database: ${process.env.DB_NAME}`))
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });

//rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later.' },
});

//authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); //pass to next middleware or route handler; if next() not called, Express stops route handler
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

///////
//ROUTES
///////

app.get('/', (req, res) => {
  res.send('API is working!');
});

//user registration
app.post('/api/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, email, hashedPassword]
    );

    return res.status(201).json({ username: email });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//user login
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (rows.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Login successful',
      token,
      role: 'user',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//get current user info
app.get('/api/me', authenticateToken, async (req, res) => { //protected route (authenticateToken() runs prior to try block)
  try {
    const { id } = req.user;
    const { rows } = await pool.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
