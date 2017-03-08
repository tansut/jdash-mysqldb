"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var helper_1 = require("./helper");
var MySQLDbProvider = (function () {
    function MySQLDbProvider(options) {
        this.options = options;
        this.connection = options.connection;
    }
    MySQLDbProvider.prototype.dashDocumentToDashModel = function (e) {
        return {
            config: JSON.parse(e.Config),
            description: e.Description,
            id: e.Id.toString(),
            layout: JSON.parse(e.Layout),
            title: e.Title,
            shareWith: e.ShareWith
        };
    };
    MySQLDbProvider.prototype.searchDashboards = function (search, query) {
        var _this = this;
        query = query || {
            limit: 100,
            startFrom: 0
        };
        query.limit = Math.min(query.limit, 100);
        query.startFrom = parseInt(query.startFrom);
        search = search || {};
        var q = {};
        var filters = [];
        if (search.appid) {
            filters.push("AppId IN (?)");
        }
        if (search.user) {
            filters.push("User IN (?)");
            (q.user = { $in: search.user });
        }
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            var q = 'SELECT * FROM dashboard WHERE ';
            var filter = filters.join(' and ');
            q += filter;
            q += " order by CreatedAt DESC ";
            q += "LIMIT " + query.startFrom + "," + (query.limit + 1);
            var params = [];
            if (search.appid) {
                if (search.appid instanceof Array)
                    params.push(search.appid);
                else
                    params.push([search.appid]);
            }
            if (search.user) {
                if (search.user instanceof Array)
                    params.push(search.user);
                else
                    params.push([search.user]);
            }
            _this.connection.query(q, params, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var hasMore = false;
                    if (results.length > query.limit) {
                        hasMore = true;
                        results.splice(results.length - 1, 1);
                    }
                    var returnValue = {
                        data: results.map(self.dashDocumentToDashModel),
                        hasMore: hasMore
                    };
                    resolve(returnValue);
                }
            });
        });
        return promise;
    };
    MySQLDbProvider.prototype.getDashboard = function (appid, id) {
        var _this = this;
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            _this.connection.query('SELECT * FROM dashboard WHERE AppId = ? and Id = ?', [appid, id], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    if (results.length) {
                        resolve(self.dashDocumentToDashModel(results[0]));
                    }
                    else
                        resolve(null);
                }
            });
        });
        return promise;
    };
    MySQLDbProvider.prototype.createDashboard = function (model) {
        var _this = this;
        var newEntity = {
            AppId: model.appid,
            Title: model.title,
            ShareWith: model.shareWith,
            Description: model.description,
            User: model.user,
            CreatedAt: helper_1.default.utcNow(),
            Config: JSON.stringify(model.config || {}),
            Layout: JSON.stringify(model.layout || {})
        };
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            _this.connection.query('INSERT INTO dashboard SET ?', newEntity, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var createResult = {
                        id: results.insertId.toString()
                    };
                    resolve(createResult);
                }
            });
        });
        return promise;
    };
    MySQLDbProvider.prototype.deleteDashboard = function (appid, id) {
        var _this = this;
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            _this.connection.query('DELETE FROM dashboard WHERE AppId = ? and Id = ?', [appid, id], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results.affectedRows);
                }
            });
        });
        return promise;
    };
    MySQLDbProvider.prototype.updateDashboard = function (appid, id, updateValues) {
        var _this = this;
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            var updateColumns = [];
            if (updateValues.config) {
                updateColumns.push({ Col: "Config", Val: JSON.stringify(updateValues.config) });
            }
            if (updateValues.description) {
                updateColumns.push({ Col: "Description", Val: updateValues.description });
            }
            if (updateValues.layout) {
                updateColumns.push({ Col: "Layout", Val: JSON.stringify(updateValues.layout) });
            }
            if (updateValues.shareWith) {
                updateColumns.push({ Col: "ShareWith", Val: updateValues.shareWith });
            }
            if (updateValues.title) {
                updateColumns.push({ Col: "Title", Val: updateValues.title });
            }
            var updateItems = '';
            for (var i = 0; i < updateColumns.length; i++) {
                updateItems += updateColumns[i].Col + " = " + mysql.escape(updateColumns[i].Val) + ", ";
            }
            updateItems = updateItems.substr(0, updateItems.length - 2);
            _this.connection.query('UPDATE dashboard SET ' + updateItems + " WHERE AppId = ? and Id = ?", [appid, id], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results.affectedRows);
                }
            });
        });
        return promise;
    };
    MySQLDbProvider.prototype.createDashlet = function (model) {
        return null;
    };
    MySQLDbProvider.prototype.searchDashlets = function (search) {
        return null;
    };
    MySQLDbProvider.prototype.deleteDashlet = function (id) {
        return null;
    };
    MySQLDbProvider.prototype.updateDashlet = function (id, updateValues) {
        return null;
    };
    return MySQLDbProvider;
}());
exports.MySQLDbProvider = MySQLDbProvider;
exports.default = function (options) { return new MySQLDbProvider(options); };
