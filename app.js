const cors = require("cors");
const express = require("express");
const mongoose = require('mongoose');
const mongoString = process.env.MONGODB_URI;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log("Could not connect database!");
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});
const app = express();
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// default route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Nodejs application."});
});

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
app.use('/api', homeRoutes);
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log(`App listening on port ${port}`)
});
