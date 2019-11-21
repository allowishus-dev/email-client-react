const credentials = require('./config/mysql_credentials');
// const knexSnakeCaseMappers = require('objection').knexSnakeCaseMappers();

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: credentials.database,
      user:     credentials.user,
      password: credentials.password
    },
    // ...knexSnakeCaseMappers
  },
};