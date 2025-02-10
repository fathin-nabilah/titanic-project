
const express = require('express');
const cors = require('cors');
const passengerRoutes = require('./routes/passengers')
const initDatabase = require('./utils/initDatabase')

const app = express();

app.use(cors());
app.use(express.json())

app.use('/api/passengers', passengerRoutes)

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
    initDatabase();
});