import { IProviderOptions, MySQLDbProvider } from '../';
import * as mysql from 'mysql';

export default class Helper {
    static provider: MySQLDbProvider;
    static testUser: string = "user_" + Math.ceil(Math.random() * 999999);
    static appid: string = "appid_" + Math.ceil(Math.random() * 999999);
    static utcNow() {
        var now = new Date();
        var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    }

    static createProvider(options: IProviderOptions) {
        this.provider = new MySQLDbProvider(options);
    }

    static createConnection() {
        return new Promise<mysql.IPool>((resolve, reject) => {
            var connection = mysql.createPool({
                connectionLimit: 120,
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: '1234',
                database: 'jdash_local'
            });
            resolve(connection);
        })
    }
}