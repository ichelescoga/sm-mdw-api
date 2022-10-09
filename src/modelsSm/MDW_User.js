const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_User', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(125),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    dpi: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    enterprise_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Enterprise',
        key: 'id'
      }
    },
    store_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Store',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MDW_User',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_User",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
