require('dotenv').config()
module.exports = {
    
    database:{
        username    :process.env.MYSQL_DB_USER,
        password    :process.env.MYSQL_DB_PASSWORD,
        database    :process.env.MYSQL_DB_SCHEMA,
        host        :process.env.MYSQL_DB_HOST
    },

    msdatabase:{
        username    :process.env.MSSQL_DB_USER,
        password    :process.env.MSSQL_DB_PASSWORD,
        database    :process.env.MSSQL_DB_SCHEMA,
        host        :process.env.MSSQL_DB_HOST
    }
    

    /*database:{
        username    :'root',//'adminsm',
        password    :'admin201!',//'Z!$fEfLXZfS2',
        database    :'pay_tbl',
        host        :'127.0.0.1'//'54.172.236.11'
    }*/
}


 
