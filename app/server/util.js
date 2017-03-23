'use strict'

var mysql = require('mysql'),
    config = require('./conf.js');

module.exports = {
    sqlQuery: function(sql, sql_Params, func) {

        var connection = mysql.createConnection(config.mysql);

        connection.connect(function(err) {
            if (err) {
                console.log("[query] - :" + err);
                return;
            }

            // console.log("[query] - : succeed!");
            
        })

        connection.query(sql, sql_Params, func);

        connection.end(function(err) {
            if (err) {
                return;
            }

            // console.log("[query] - : end!");
        });
    }
}