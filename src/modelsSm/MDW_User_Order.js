const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_User_Order', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false
    },
    order_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false
    },
    initial_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    geo_localization: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MDW_User_Order',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_User_Order",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
