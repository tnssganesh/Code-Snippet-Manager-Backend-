// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import Routes
import usersRoutes from './routes/api/users.js';
import snippetsRoutes from './routes/api/snippets.js';

// Load environment variables from .env file
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
// Enable All CORS Requests (for frontend development)
app.use(cors());

// Body Parser Middleware (allows us to get data in req.body)
// The limit is set high to handle potentially large code snippets
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Define Routes
// The /api/users routes handle registration and login
app.use('/api/users', usersRoutes);
// The /api/snippets routes handle CRUD for code snippets
app.use('/api/snippets', snippetsRoutes);


// Simple Root Route
app.get('/', (req, res) => res.send('Snippet Manager API Running'));


// Error Handling Middleware (Mandatory Requirement)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));