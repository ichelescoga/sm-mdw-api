const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MDW_Order', {
    id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    origin_store_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    origin_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aloha_store: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_number: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    origin_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    payment_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_authorization: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payment_change: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payment_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    observations: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    client_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      references: {
        model: 'MDW_Client',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigned_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    process_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    order_raw_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    },
    delivery_day: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    send_aloha: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    aloha_time_sended: {
      type: DataTypes.DATE,
      allowNull: true
    },
    context_path: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    desc_cpn_callcenter: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    amount_cpn_callcenter: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cupon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descrip_cpn: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    amount_cpn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sms_cpn: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MDW_Order',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_MDW_Order",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
