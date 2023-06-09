const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Order_Change', {
    id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'MDW_Order',
        key: 'id'
      }
    },
    cash_exchange: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'MDW_User',
        key: 'id'
      }
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Order_Change',
    schema: 'dbo',
    timestamps: false
  });
};
