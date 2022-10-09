'use strict'
let mysql = require ('mysql2');

let str_connection = mysql.createPool({
    user        :'adminsm',
    password    :'Z!$fEfLXZfS2',
    database    :'pay_tbl',
    host        :'non-sanmartindb.cebpgfidyejy.us-east-1.rds.amazonaws.com',
    port        : 3308,
    charset     : 'utf8mb4',
    connectionLimit : 10000,
    waitForConnections: true,
    queueLimit: 0
})

module.exports = {
    str_connection
}
