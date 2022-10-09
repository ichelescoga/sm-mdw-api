const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_User_Vehicle', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_User',
        key: 'id'
      }
    },
    license_plate: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    assigned_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    desassigned_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MDW_User_Vehicle',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_User_Vehicle",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
