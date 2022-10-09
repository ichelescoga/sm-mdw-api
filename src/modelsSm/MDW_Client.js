const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Client', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    nit: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    alternate_phone: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    delivery_address: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MDW_Client',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_Client",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
