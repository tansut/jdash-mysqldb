import { IDBProvider, ISearchDashboard, ISearchDashlet } from 'jdash-api-core';
import * as core from 'jdash-core';
import * as mysql from 'mysql';
export interface IProviderOptions {
    connection: mysql.IPool;
}
export declare class MySQLDbProvider implements IDBProvider {
    options: IProviderOptions;
    connection: mysql.IPool;
    constructor(options: IProviderOptions);
    private dashDocumentToDashModel(e);
    private dashletDocumentToModel(e);
    searchDashboards(search: ISearchDashboard, query?: core.Query): Promise<core.QueryResult<core.DashboardModel>>;
    getDashboard(appid: string, id: string): Promise<core.GetDashboardResult>;
    createDashboard(model: core.DashboardModel): Promise<core.CreateResult>;
    deleteDashboard(appid: string, id: string): Promise<any>;
    updateDashboard(appid: string, id: string, updateValues: core.DashboardUpdateModel): Promise<any>;
    createDashlet(model: core.DashletCreateModel): Promise<core.CreateResult>;
    deleteDashlet(id: string | Array<string>): Promise<any>;
    updateDashlet(id: string, updateValues: core.DashletUpdateModel): Promise<any>;
    searchDashlets(search: ISearchDashlet): Promise<Array<core.DashletModel>>;
}
declare var _default: (options: IProviderOptions) => MySQLDbProvider;
export default _default;
