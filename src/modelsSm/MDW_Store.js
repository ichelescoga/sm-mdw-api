const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Store', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    aloha_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wordpress_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yalo_code: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MDW_Store',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_Store",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
