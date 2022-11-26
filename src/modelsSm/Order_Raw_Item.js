const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Raw_Item', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    order_raw_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'Order_Raw',
        key: 'id'
      }
    },
    item_level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_id: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    item_price: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    item_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_group_id: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    take_out_price: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    parent_sku: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    },
    payment_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Order_Raw_Item',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Order_Raw_Item",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
