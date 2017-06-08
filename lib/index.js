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
    MySQLDbProvider.prototype.dashletDocumentToModel = function (e) {
        return {
            configuration: JSON.parse(e.Configuration),
            dashboardId: e.DashboardId,
            description: e.Description,
            id: e.Id.toString(),
            moduleId: e.ModuleId,
            title: e.Title
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
        var filters = [];
        if (search.appid) {
            filters.push("AppId IN (?)");
        }
        if (search.user) {
            filters.push("User IN (?)");
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
                        var dashboard = self.dashDocumentToDashModel(results[0]);
                        return self.searchDashlets({
                            dashboardId: dashboard.id
                        }).then(function (dashlets) {
                            resolve({
                                dashboard: dashboard,
                                dashlets: dashlets
                            });
                        });
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
        var _this = this;
        var newEntity = {
            DashboardId: model.dashboardId,
            Configuration: JSON.stringify(model.configuration || {}),
            ModuleId: model.moduleId,
            Title: model.title,
            Description: model.description,
            CreatedAt: helper_1.default.utcNow()
        };
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            _this.connection.query('INSERT INTO dashlet SET ?', newEntity, function (error, results, fields) {
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
    MySQLDbProvider.prototype.deleteDashlet = function (id) {
        var _this = this;
        if (!(id instanceof Array)) {
            id = [id];
        }
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            _this.connection.query('DELETE FROM dashlet WHERE Id IN (?)', [id], function (error, results, fields) {
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
    MySQLDbProvider.prototype.updateDashlet = function (id, updateValues) {
        var _this = this;
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            var updateColumns = [];
            if (updateValues.configuration) {
                updateColumns.push({ Col: "Configuration", Val: JSON.stringify(updateValues.configuration) });
            }
            if (updateValues.description) {
                updateColumns.push({ Col: "Description", Val: updateValues.description });
            }
            if (updateValues.title) {
                updateColumns.push({ Col: "Title", Val: updateValues.title });
            }
            var updateItems = '';
            for (var i = 0; i < updateColumns.length; i++) {
                updateItems += updateColumns[i].Col + " = " + mysql.escape(updateColumns[i].Val) + ", ";
            }
            updateItems = updateItems.substr(0, updateItems.length - 2);
            _this.connection.query('UPDATE dashlet SET ' + updateItems + " WHERE  Id = ?", [id], function (error, results, fields) {
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
    MySQLDbProvider.prototype.searchDashlets = function (search) {
        var _this = this;
        var filters = [];
        if (search.user instanceof Array) {
            filters.push({ Clause: " User IN (?) ", Value: search.user });
        }
        else if (search.user) {
            filters.push({ Clause: " User = ? ", Value: search.user });
        }
        if (search.dashboardId) {
            filters.push({ Clause: " DashboardId = ?", Value: search.dashboardId });
        }
        var query = "SELECT * FROM dashlet WHERE ";
        var params = [];
        for (var i in filters) {
            query += filters[i].Clause;
            params.push(filters[i].Value);
        }
        query += " order by CreatedAt desc ";
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            _this.connection.query(query, params, function (error, dashletEntities, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var models = dashletEntities.map(self.dashletDocumentToModel);
                    resolve(models);
                }
            });
        });
        return promise;
    };
    return MySQLDbProvider;
}());
exports.MySQLDbProvider = MySQLDbProvider;
exports.default = function (options) { return new MySQLDbProvider(options); };
