import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import { generateVideo } from './my-replicate-api/videoGeneration.js';
import { readdir } from 'node:fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


// Database configuration
const dbConfig = {
  host: process.env.DB_HOST, // Use environment variable
  user: process.env.DB_USER, // Use environment variable
  password: process.env.DB_PASSWORD, // Use environment variable
  database: process.env.DB_NAME // Use environment variable
};

// Demo user credentials (hardcoded for now)
const DEMO_USER = {
  username: 'demo',
  password: 'demo123'
};

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'SecretKeyOfYourOwn',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Database connection pool
const pool = mysql.createPool(dbConfig);

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    req.session.user = { username };
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/dashboard', requireLogin, async (req, res) => {
  try {
    // Read all files from the outputs directory
    const files = await readdir('./outputs');
    
    // Filter for MP4 files and create video objects
    const videos = files
      .filter(file => file.endsWith('.mp4'))
      .map(file => ({
        video_url: `/outputs/${file}`,
        prompt: file.replace('_output.mp4', ''), // Extract prompt from filename if needed
        status: 'completed',
        created_at: new Date().toLocaleString() // You might want to get actual file creation date
      }));

    res.render('dashboard', { 
      user: req.session.user,
      videos: videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.render('dashboard', { 
      user: req.session.user,
      videos: [],
      error: 'Failed to fetch videos'
    });
  }
});

app.get('/generate', requireLogin, (req, res) => {
  res.render('generate', { 
    user: req.session.user
  });
});

app.post('/generate-video', requireLogin, async (req, res) => {
  try {
    const { prompt, width, height, video_length } = req.body;
    
    // Create custom parameters object
    const customParams = {
      width: width || 854,
      height: height || 480,
      video_length: video_length || 129
    };

    const result = await generateVideo(prompt, customParams);
    
    // Save to database
    //await pool.query(
    //  'INSERT INTO generated_videos (user_id, prompt, video_url, status) VALUES (?, ?, ?, ?)',
    //  [req.session.user.username, prompt, result.videoUrl, result.status]
    //);

    res.json({ 
      success: true, 
      video: result,
      message: 'Video generated successfully'
    });
  } catch (error) {
    console.error('Error generating video:', error);
    res.json({ 
      success: false, 
      error: error.message || 'Failed to generate video'
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Add static file serving for the outputs directory
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Add a route for the default starting page
app.get('/', (req, res) => {
  res.redirect('/login'); // Change '/login' to your desired starting page
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Please try these solutions:`);
    console.log('1. Kill the process using port 3000');
    console.log('2. Use a different port by setting PORT environment variable');
    process.exit(1);
  }
}); 
