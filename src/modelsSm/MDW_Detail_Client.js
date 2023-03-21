const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Detail_Client', {
    id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_client: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'MDW_Client',
        key: 'id'
      }
    },
    nit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    direction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Detail_Client',
    schema: 'dbo',
    timestamps: false
  });
};
