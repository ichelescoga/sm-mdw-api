const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Store_Alert', {
    id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    store_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'MDW_Store',
        key: 'id'
      }
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    alert_number: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Store_Alert',
    schema: 'dbo',
    timestamps: false
  });
};
