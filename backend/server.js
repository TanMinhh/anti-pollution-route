const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { startWorker } = require('./worker');
const routes = require('./api/routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log(err));

app.use('/api', routes);

startWorker();

app.listen(process.env.PORT || 5000);