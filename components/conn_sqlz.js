const { Sequelize } = require('sequelize');
const { msdatabase } = require('./config');
const {tedious} = require('tedious')

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
  
    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
  };
    
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