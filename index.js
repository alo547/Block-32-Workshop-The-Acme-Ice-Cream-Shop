const { initDB } = require('./Block-32-Workshop-The-Acme-Ice-Cream-Shop');

initDB().then(() => {
    console.log('Database initialized');
});