"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
var mysql = require("mysql");
var Helper = (function () {
    function Helper() {
    }
    Helper.utcNow = function () {
        var now = new Date();
        var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    };
    Helper.createProvider = function (options) {
        this.provider = new _1.MySQLDbProvider(options);
    };
    Helper.createConnection = function () {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                connectionLimit: 120,
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: '1234',
                database: 'jdash_local'
            });
            resolve(connection);
        });
    };
    return Helper;
}());
Helper.testUser = "user_" + Math.ceil(Math.random() * 999999);
Helper.appid = "appid_" + Math.ceil(Math.random() * 999999);
exports.default = Helper;
