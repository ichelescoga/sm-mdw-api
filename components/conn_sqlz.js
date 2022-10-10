const { Sequelize } = require('sequelize');
const { msdatabase } = require('./config');
const {tedious} = require('tedious')
    
const sequelize = new Sequelize(
    msdatabase.database,
    msdatabase.username,
    msdatabase.password,
    {
        host:msdatabase.host,
        port: 1433,
        dialect:"mssql",
        dialectModule: tedious,
        logging: console.log,
        encrypt: false
    }
);

module.exports = sequelize;