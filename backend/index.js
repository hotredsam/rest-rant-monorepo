// Modules and Globals
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

// CORS Options
const corsOptions = {
    origin: 'http://localhost:3000',  // replace with your application's client-side URL
    credentials: true,
};

// Express Settings
app.use(cors(corsOptions));  // Updated CORS settings
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Controllers & Routes
app.use(express.urlencoded({ extended: true }))
app.use('/places', require('./controllers/places'))
app.use('/users', require('./controllers/users'))
app.use('/authentication', require('./controllers/authentication'))

// Listen for Connections
app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
});
