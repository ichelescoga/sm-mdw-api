const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Product', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    name_en: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Product',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_Product",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
