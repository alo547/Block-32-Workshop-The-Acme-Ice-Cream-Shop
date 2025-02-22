const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost/block32_ice_cream_shop',
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

const createTables = async () => {
    try {
        const SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            is_favorite BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        );
        `;
        await client.query(SQL);
        console.log('Flavors table created');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

const seedData = async () => {
    try {
        const SQL = `
        INSERT INTO flavors (name, is_favorite) VALUES
        ('Vanilla', true),
        ('Chocolate', false),
        ('Strawberry', true);
        `;
        await client.query(SQL);
        console.log('Flavors seeded');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

const initDB = async () => {
    try {
        await connectDB();
        await createTables();
        await seedData();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = { client, connectDB, initDB };