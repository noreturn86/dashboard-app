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


//////////////////////
//HELPER FUNCTIONS////
//////////////////////


//return player stats for all player ids in the list
async function getPlayerStats(listOfIds) {
  try {
    const statsList = await Promise.all(
      listOfIds.map(async (id) => {
        const res = await fetch(`https://api-web.nhle.com/v1/player/${id}/landing`);
        if (!res.ok) {
          console.error(`Failed to fetch player ${id}: ${res.status}`);
          return null;
        }
        const data = await res.json();
        return data;
      })
    );

    return statsList.filter((s) => s !== null);
  } catch (err) {
    console.error("Error fetching player stats:", err);
    throw err;
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
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    //get user profile
    const userResult = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    //get widgets for user
    const widgetResult = await pool.query(
      `SELECT id, widget_type, props, pos_x, pos_y, width, height
       FROM user_widgets
       WHERE user_id = $1
       ORDER BY id ASC`,
      [userId]
    );

    //shape widgets for frontend
    const widgets = widgetResult.rows.map(row => ({
      id: row.id,
      type: row.widget_type,
      props: row.props,
      layout: {
        x: row.pos_x,
        y: row.pos_y,
        w: row.width,
        h: row.height,
      },
    }));

    return res.json({
      ...user,
      widgets,
    });

  } catch (err) {
    console.error("Fetch user error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});



app.post("/api/widgets", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      widget_type,
      props,
      pos_x = 0,
      pos_y = 0,
      width = 4,
      height = 3,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO user_widgets
       (user_id, widget_type, props, pos_x, pos_y, width, height)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, widget_type, props, pos_x, pos_y, width, height]
    );

    const row = result.rows[0];

    //shape to match frontend
    const savedWidget = {
      id: row.id,
      type: row.widget_type,
      props: row.props,
      layout: {
        x: row.pos_x,
        y: row.pos_y,
        w: row.width,
        h: row.height,
      },
    };

    res.json(savedWidget);
  } catch (err) {
    console.error("Create widget error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/weather", authenticateToken, async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ message: "City is required" });

    const apiKey = process.env.WEATHER_API_KEY;

    const fetchRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({ message: "Weather API error" });
    }

    const data = await fetchRes.json();
    res.json(data);

  } catch (err) {
    ku
    kconsole.error("Weather fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/nhl/teams", authenticateToken, async (req, res) => {
  try {
    const nhlRes = await fetch("https://api-web.nhle.com/v1/standings/now");

    if (!nhlRes.ok) {
      return res
        .status(nhlRes.status)
        .json({ message: "Failed to fetch NHL standings" });
    }

    const data = await nhlRes.json();

    //data.standings is an array of teams in order of league standings
    const teamsRaw = data.standings;

    const nhlTeams = teamsRaw.map(t => ({
      fullName: t.teamName.default,
      commonName: t.teamCommonName.default,
      abbrevName: t.teamAbbrev.default,
      logo: t.teamLogo,
      wins: t.wins,
      losses: t.losses,
      otLosses: t.otLosses,
      points: t.points,
      pointsPercentage: t.pointPctg,
      divRank: t.divisionSequence,
      confRank: t.conferenceSequence,
      leagueRank: t.leagueSequence,
    }));

    res.json({ nhlTeams });

  } catch (err) {
    console.error("NHL standings fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/nhl/roster/:teamCode", authenticateToken, async (req, res) => {
  const teamCode = req.params.teamCode;

  try {
    const teamRes = await fetch(`https://api-web.nhle.com/v1/roster/${teamCode}/current`);
    if (!teamRes.ok) {
      return res.status(teamRes.status).json({ message: "Failed to fetch NHL roster" });
    }

    const data = await teamRes.json();
    const rosteredPlayers = [...data.forwards, ...data.defensemen, ...data.goalies];
    const allIds = rosteredPlayers.map((p) => p.id);

    //fetch detailed stats for all players
    const playersRaw = await getPlayerStats(allIds);

    //map to simplified structure
    const players = playersRaw.map((p) => {
      const reg = p.featuredStats?.regularSeason?.subSeason ?? {};

      return {
        firstName: p.firstName?.default ?? "",
        lastName: p.lastName?.default ?? "",
        number: p.sweaterNumber ?? null,
        position: p.position ?? "",
        gamesPlayed: reg.gamesPlayed ?? 0,
        goals: reg.goals ?? 0,
        assists: reg.assists ?? 0,
        points: reg.points ?? 0,
        headshot: p.headshot ?? null,
      };
    });

    res.json({ players });
  } catch (err) {
    console.error("NHL roster fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});





//start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
