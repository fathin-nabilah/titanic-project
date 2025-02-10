const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req,res) => {

    console.log('Get all passengers data')

    try {
        const [results] = await pool.query('SELECT * FROM passengers');
        res.json(results);
        
    } catch (error) {
        console.error('Error retrieving passengers data: ', error)
        res.status(500).json({ error: 'Failed to retrieve passengers'});
    }
    
});

router.post('/filter', async (req, res) => {
    const { survivalStatus, ageRange, passengerClass, gender, embarkationPoint, travellingStatus } = req.body;

    console.log('filters: ', req.body)

    let query = 'SELECT * FROM passengers WHERE 1=1';
    const params = [];

    if (ageRange) {
        if (ageRange.includeNull) {
            query += ' AND (Age BETWEEN ? AND ? OR Age IS NULL)';
            params.push(ageRange.min, ageRange.max);
        } else {
            query += ' AND Age BETWEEN ? AND ?';
            params.push(ageRange.min, ageRange.max);            
        }
        
    }

    if (passengerClass && passengerClass.length > 0) {
        query += ` AND Pclass IN (${passengerClass.map(() => '?').join(', ')})`;
        params.push(...passengerClass.map(cls => parseInt(cls)));
    }

    if (gender && gender.length > 0) {
        query += ` AND Sex IN (${gender.map(() => '?').join(', ')})`;
        params.push(...gender);
    }

    if (embarkationPoint && embarkationPoint.length > 0) {
        if (embarkationPoint.includes('null')) {
            const validPoints = embarkationPoint.filter(e => e !== 'null');
            if (validPoints.length > 0) {
                query += ` AND (Embarked IN (${validPoints.map(() => '?').join(', ')}) OR Embarked IS NULL)`;
                params.push(...validPoints);
            } else {
                query += ` AND Embarked IS NULL`;
            }
        } else {
            query += ` AND Embarked IN (${embarkationPoint.map(() => '?').join(', ')})`;
            params.push(...embarkationPoint.map(cls => (isNaN(parseInt(cls)) ? null : parseInt(cls))));

        }
        
    }

    if (survivalStatus && survivalStatus[0] !== 'all') {
        query += ` AND Survived = ?`;
        params.push(parseInt(survivalStatus[0]));
    }

    if (travellingStatus && travellingStatus[0] !== 'all') {
        if (travellingStatus[0] === 'Family') {
            query += ` AND (SibSp > 0 OR Parch > 0)`;
        } else if (travellingStatus[0] === 'Alone') {
            query += ` AND (SibSp = 0 AND Parch = 0)`;
        }
    }

    // console.log('Generated Query:', query);
    // console.log('Params:', params);

    try {
        const [results] = await pool.query(query, params);
        console.log('Filtered passengers count: ', results.length)
        res.json(results);
    } catch (error) {
        console.error('Error getting filtered passengers:', error);
        res.status(500).json({ error: 'Failed to retrieve filtered passengers' });
    }
});


module.exports = router