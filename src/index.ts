import { IDBProvider, ISearchDashboard, ISearchDashlet } from 'jdash-api-core';
import { LayoutModel, Metadata } from 'jdash-core/lib';
import * as core from 'jdash-core';
import { DashboardEntity } from './models/dashboard';
import { DashletEntity } from './models/dashlet';
import * as mysql from 'mysql';

import helper from './helper';

export interface IProviderOptions {
    connection: mysql.IPool;
}

export class MySQLDbProvider implements IDBProvider {
    connection: mysql.IPool;


    constructor(public options: IProviderOptions) {
        this.connection = options.connection;
    }

    private dashDocumentToDashModel(e: DashboardEntity): core.DashboardModel {
        return <core.DashboardModel>{
            config: JSON.parse(e.Config),
            description: e.Description,
            id: e.Id.toString(),
            layout: JSON.parse(e.Layout),
            title: e.Title,
            shareWith: e.ShareWith
        }
    }

    private dashletDocumentToModel(e: DashletEntity): core.DashletModel {
        return <core.DashletModel>{
            configuration: JSON.parse(e.Configuration),
            dashboardId: e.DashboardId,
            description: e.Description,
            id: e.Id.toString(),
            moduleId: e.ModuleId,
            title: e.Title
        }
    }

    searchDashboards(search: ISearchDashboard, query?: core.Query): Promise<core.QueryResult<core.DashboardModel>> {
        query = query || {
            limit: 100,
            startFrom: 0
        }
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
        var promise = new Promise((resolve, reject) => {
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

            this.connection.query(q, params, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    var hasMore = false;
                    if (results.length > query.limit) {// hasMore check
                        hasMore = true;
                        results.splice(results.length - 1, 1); // remove +1 element from models
                    }
                    var returnValue = <core.QueryResult<core.DashboardModel>>{
                        data: results.map(self.dashDocumentToDashModel),
                        hasMore: hasMore
                    }
                    resolve(returnValue);
                }
            })
        });


        return promise;
    }

    getDashboard(appid: string, id: string): Promise<core.GetDashboardResult> {


        var self = this;
        var promise = new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM dashboard WHERE AppId = ? and Id = ?', [appid, id], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    if (results.length) {
                        var dashboard = self.dashDocumentToDashModel(results[0]);
                        return self.searchDashlets({
                            dashboardId: dashboard.id
                        }).then((dashlets) => {
                            resolve({
                                dashboard: dashboard,
                                dashlets: dashlets
                            });
                        })
                    }
                    else resolve(null);
                }
            })
        });


        return promise;
    }

    createDashboard(model: core.DashboardModel): Promise<core.CreateResult> {
        var newEntity: DashboardEntity = {
            AppId: model.appid,
            Title: model.title,
            ShareWith: model.shareWith,
            Description: model.description,
            User: model.user,
            CreatedAt: helper.utcNow(),
            Config: JSON.stringify(model.config || {}),
            Layout: JSON.stringify(model.layout || {})
        }

        var self = this;
        var promise = new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO dashboard SET ?', newEntity, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    var createResult: core.CreateResult = {
                        id: results.insertId.toString()
                    };
                    resolve(createResult);
                }
            });
        });


        return promise;
    }

    deleteDashboard(appid: string, id: string): Promise<any> {


        var self = this;
        var promise = new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM dashboard WHERE AppId = ? and Id = ?', [appid, id], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows);
                }
            })
        });


        return promise;
    }

    updateDashboard(appid: string, id: string, updateValues: core.DashboardUpdateModel): Promise<any> {


        var self = this;
        var promise = new Promise((resolve, reject) => {

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

            this.connection.query('UPDATE dashboard SET ' + updateItems + " WHERE AppId = ? and Id = ?", [appid, id], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows);
                }
            })
        });


        return promise;
    }

    createDashlet(model: core.DashletCreateModel): Promise<core.CreateResult> {
        var newEntity: DashletEntity = {
            DashboardId: model.dashboardId,
            Configuration: JSON.stringify(model.configuration || {}),
            ModuleId: model.moduleId,
            Title: model.title,
            Description: model.description,
            CreatedAt: helper.utcNow()
        }


        var self = this;
        var promise = new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO dashlet SET ?', newEntity, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    var createResult: core.CreateResult = {
                        id: results.insertId.toString()
                    };
                    resolve(createResult);
                }
            });
        });

        return promise;

    }


    deleteDashlet(id: string | Array<string>): Promise<any> {

        if (!(id instanceof Array)) {
            id = [id];
        }

        var self = this;
        var promise = new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM dashlet WHERE Id IN (?)', [id], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows);
                }
            })
        });

        return promise;
    }

    updateDashlet(id: string, updateValues: core.DashletUpdateModel): Promise<any> {

        var self = this;
        var promise = new Promise((resolve, reject) => {

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

            this.connection.query('UPDATE dashlet SET ' + updateItems + " WHERE  Id = ?", [id], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows);
                }
            })
        });


        return promise;
    }

    searchDashlets(search: ISearchDashlet): Promise<Array<core.DashletModel>> {


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
        var promise = new Promise((resolve, reject) => {
            this.connection.query(query, params, function (error, dashletEntities, fields) {
                if (error) {
                    reject(error);
                } else {
                    var models = dashletEntities.map(self.dashletDocumentToModel);
                    resolve(models);
                }
            });
        });

        return promise;
    }

}


export default (options: IProviderOptions) => new MySQLDbProvider(options);