const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Order_Detail', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Order',
        key: 'id'
      }
    },
    sku: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Product',
        key: 'id'
      }
    },
    parent_sku: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Order_Detail',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_Order_Detail",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
