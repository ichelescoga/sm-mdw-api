const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Order_Store', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Store',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Order',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Order_Store',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_Order_Store",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
