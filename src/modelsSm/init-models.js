var DataTypes = require("sequelize").DataTypes;
var _MDW_Client = require("./MDW_Client");
var _MDW_Enterprise = require("./MDW_Enterprise");
var _MDW_Order = require("./MDW_Order");
var _MDW_Order_Detail = require("./MDW_Order_Detail");
var _MDW_Order_Store = require("./MDW_Order_Store");
var _MDW_Product = require("./MDW_Product");
var _MDW_Store = require("./MDW_Store");
var _MDW_Store_Map = require("./MDW_Store_Map");
var _MDW_User = require("./MDW_User");
var _MDW_User_Order = require("./MDW_User_Order");
var _MDW_User_Store = require("./MDW_User_Store");
var _MDW_User_Vehicle = require("./MDW_User_Vehicle");
var _Order_Raw = require("./Order_Raw");
var _Order_Raw_Item = require("./Order_Raw_Item");

function initModels(sequelize) {
  var MDW_Client = _MDW_Client(sequelize, DataTypes);
  var MDW_Enterprise = _MDW_Enterprise(sequelize, DataTypes);
  var MDW_Order = _MDW_Order(sequelize, DataTypes);
  var MDW_Order_Detail = _MDW_Order_Detail(sequelize, DataTypes);
  var MDW_Order_Store = _MDW_Order_Store(sequelize, DataTypes);
  var MDW_Product = _MDW_Product(sequelize, DataTypes);
  var MDW_Store = _MDW_Store(sequelize, DataTypes);
  var MDW_Store_Map = _MDW_Store_Map(sequelize, DataTypes);
  var MDW_User = _MDW_User(sequelize, DataTypes);
  var MDW_User_Order = _MDW_User_Order(sequelize, DataTypes);
  var MDW_User_Store = _MDW_User_Store(sequelize, DataTypes);
  var MDW_User_Vehicle = _MDW_User_Vehicle(sequelize, DataTypes);
  var Order_Raw = _Order_Raw(sequelize, DataTypes);
  var Order_Raw_Item = _Order_Raw_Item(sequelize, DataTypes);

  MDW_Order.belongsTo(MDW_Client, { as: "client", foreignKey: "client_id"});
  MDW_Client.hasMany(MDW_Order, { as: "MDW_Orders", foreignKey: "client_id"});
  MDW_User.belongsTo(MDW_Enterprise, { as: "enterprise", foreignKey: "enterprise_id"});
  MDW_Enterprise.hasMany(MDW_User, { as: "MDW_Users", foreignKey: "enterprise_id"});
  MDW_Order_Detail.belongsTo(MDW_Order, { as: "order", foreignKey: "order_id"});
  MDW_Order.hasMany(MDW_Order_Detail, { as: "MDW_Order_Details", foreignKey: "order_id"});
  MDW_Order_Store.belongsTo(MDW_Order, { as: "order", foreignKey: "order_id"});
  MDW_Order.hasMany(MDW_Order_Store, { as: "MDW_Order_Stores", foreignKey: "order_id"});
  MDW_User_Order.belongsTo(MDW_Order, { as: "order", foreignKey: "order_id"});
  MDW_Order.hasMany(MDW_User_Order, { as: "MDW_User_Orders", foreignKey: "order_id"});
  MDW_Order_Detail.belongsTo(MDW_Product, { as: "product", foreignKey: "product_id"});
  MDW_Product.hasMany(MDW_Order_Detail, { as: "MDW_Order_Details", foreignKey: "product_id"});
  MDW_Order_Store.belongsTo(MDW_Store, { as: "store", foreignKey: "store_id"});
  MDW_Store.hasMany(MDW_Order_Store, { as: "MDW_Order_Stores", foreignKey: "store_id"});
  MDW_Store_Map.belongsTo(MDW_Store, { as: "store", foreignKey: "store_id"});
  MDW_Store.hasMany(MDW_Store_Map, { as: "MDW_Store_Maps", foreignKey: "store_id"});
  MDW_User.belongsTo(MDW_Store, { as: "store", foreignKey: "store_id"});
  MDW_Store.hasMany(MDW_User, { as: "MDW_Users", foreignKey: "store_id"});
  MDW_User_Store.belongsTo(MDW_Store, { as: "store", foreignKey: "store_id"});
  MDW_Store.hasMany(MDW_User_Store, { as: "MDW_User_Stores", foreignKey: "store_id"});
  MDW_User_Order.belongsTo(MDW_User, { as: "user", foreignKey: "user_id"});
  MDW_User.hasMany(MDW_User_Order, { as: "MDW_User_Orders", foreignKey: "user_id"});
  MDW_User_Store.belongsTo(MDW_User, { as: "user", foreignKey: "user_id"});
  MDW_User.hasMany(MDW_User_Store, { as: "MDW_User_Stores", foreignKey: "user_id"});
  MDW_User_Vehicle.belongsTo(MDW_User, { as: "user", foreignKey: "user_id"});
  MDW_User.hasMany(MDW_User_Vehicle, { as: "MDW_User_Vehicles", foreignKey: "user_id"});
  Order_Raw_Item.belongsTo(Order_Raw, { as: "order_raw", foreignKey: "order_raw_id"});
  Order_Raw.hasMany(Order_Raw_Item, { as: "Order_Raw_Items", foreignKey: "order_raw_id"});

  return {
    MDW_Client,
    MDW_Enterprise,
    MDW_Order,
    MDW_Order_Detail,
    MDW_Order_Store,
    MDW_Product,
    MDW_Store,
    MDW_Store_Map,
    MDW_User,
    MDW_User_Order,
    MDW_User_Store,
    MDW_User_Vehicle,
    Order_Raw,
    Order_Raw_Item,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
