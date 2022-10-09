const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Raw', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    customer_info_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    store_info_id: {
      type: DataTypes.DECIMAL(5,0),
      allowNull: false
    },
    order_info_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer_address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    customer_country: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    customer_city: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    customer_phone: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    customer_first_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    customer_last_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    customer_email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    tender_info_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payment_type: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false
    },
    payment_balance: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false
    },
    tender_amount: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false
    },
    tender_id: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    reference_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    order_timer: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    order_mode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    origin: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Order_Raw',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Order_Raw",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
