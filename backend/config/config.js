require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root', // Default username
    password: process.env.DB_PASSWORD || '',      // Default password
    database: process.env.DB_NAME || 'database_development', // Default database name
    host: process.env.DB_HOST || '127.0.0.1',     // Default host
    dialect: 'mysql',                             // Database dialect (mysql, postgres, etc.)
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database_production',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
};
