const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Store_Map', {
    id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    wp_store_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yalo_store_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    aloha_store_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    store_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'MDW_Store',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'MDW_Store_Map',
    schema: 'dbo',
    timestamps: false
  });
};
