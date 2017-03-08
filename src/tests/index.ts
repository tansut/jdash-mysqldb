import * as mocha from 'mocha';
import Helper from './helper';
import dashboardtests from './dashboard';
import dashlettests from './dashlet';
require('should');

describe('jdash-mysqldb Tests', function () {
    before(function (done) {

        Helper.createConnection().then(conn => {
            Helper.createProvider({
                connection: conn
            })
            done();
        }).catch(err => done(err))
    });
    dashboardtests();
    dashlettests();
    after(function () {

    });
});