const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db')

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL');
        connection.release();

        const createTable = `CREATE TABLE IF NOT EXISTS passengers (
        PassengerId INT PRIMARY KEY, 
        Survived TINYINT, 
        Pclass INT NULL, 
        Name VARCHAR(255), 
        Sex VARCHAR(10) NULL, 
        Age FLOAT NULL, 
        SibSp INT NULL, 
        Parch INT NULL, 
        Ticket VARCHAR(255) NULL, 
        Fare FLOAT NULL, 
        Cabin VARCHAR(255) NULL, 
        Embarked VARCHAR(255) NULL)`;

        // check if table exist
        const [results] = await pool.query("SHOW TABLES LIKE 'passengers'");
        
        if (results.length === 0) {
            await pool.query(createTable);
            console.log('Passengers table created successfully')

            const rows = [];
        
            fs.createReadStream('train.csv')
            .pipe(csv())
            .on('data', (row) => {
                rows.push(row)
            })
            .on('end', async () => {
                for (const row of rows) {
                    const age = row.Age === '' ? null : row.Age;
                    const cabin = row.Cabin === '' ? null : row.Cabin;
                    const embarked = row.Embarked === '' ? null : row.Embarked;
    
                    const insertQuery = `INSERT INTO passengers (PassengerId, Survived, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    try {
                        await pool.query(insertQuery, [
                            row.PassengerId, 
                            row.Survived, 
                            row.Pclass, 
                            row.Name, 
                            row.Sex, 
                            age, 
                            row.SibSp, 
                            row.Parch, 
                            row.Ticket, 
                            row.Fare, 
                            cabin, 
                            embarked
                        ]); 
                    } catch (error) {
                        console.error('Error inserting passenger data: ', error)
                    }
                }

                console.log('CSV file successfully processed');                        
                        
            });
            
        } else {
            console.log('Table passengers exists')
        }

    } catch (error) {
        console.error('Error initializing database: ', error)
        setTimeout(initDatabase, 5000)
    }
};

module.exports = initDatabase;