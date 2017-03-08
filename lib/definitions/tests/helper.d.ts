import { IProviderOptions, MySQLDbProvider } from '../';
import * as mysql from 'mysql';
export default class Helper {
    static provider: MySQLDbProvider;
    static testUser: string;
    static appid: string;
    static utcNow(): Date;
    static createProvider(options: IProviderOptions): void;
    static createConnection(): Promise<mysql.IPool>;
}
