
const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelsSm/init-models");
const OrderRepository = require('./OrderRepository');
let models = initModels(sequelize);

let UserRepository = function () {

    let assignUserToStore = async(params) => {
        return await models.MDW_User_Store.create({
            store_id: params.storeId,
            user_id: params.userId,
            status: 1
        }).then( async resp =>{
            //console.log("resp:")
            //console.log(resp);
            newAssign = resp.dataValues.id
            await models.MDW_User_Store.update({
                status: 0
            },{
                where: {
                    store_id: params.storeId,
                    user_id: params.userId,
                    [Op.ne]: [{id: newAssign}]
                }
            }
            )
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    let getUsersByStoreAndType = async (params) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                store_id: params.storeId,
                status: 1,
                user_type: params.userType
            },
        });
    }

    let getStoreAssignedUsers = async (userType) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                status: 1,
            },
        });
    }

    let getAssignedPilotsByStore = async (storeId) => {
        return await  models.MDW_User_Store.findAll({
            where: {
                status: 1,
                store_id: storeId
            },
            include: [{
                model: models.MDW_User,
                as: 'user',
                required: true
                },
            ]
        });
    }

    let getAllUsersByType = async (userType) => {
        return await  models.MDW_User.findAll({
            where: {
                status: 1,
                user_type: userType
            },
            include: [{
                model: models.MDW_Enterprise,
                as: 'enterprise',
                required: true
                },
            ]
        });
    }

    let getAllStores = async () => {
        return await  models.MDW_Store.findAll({
            where: {
                status: 1
            },
        });
    }

    return {
        assignUserToStore,
        getUsersByStoreAndType,
        getStoreAssignedUsers,
        getAllStores,
        getAssignedPilotsByStore,
        getAllUsersByType
    }

}

module.exports = UserRepository();