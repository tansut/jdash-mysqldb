"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
var dashboard_1 = require("./dashboard");
var dashlet_1 = require("./dashlet");
require('should');
describe('jdash-mysqldb Tests', function () {
    before(function (done) {
        helper_1.default.createConnection().then(function (conn) {
            helper_1.default.createProvider({
                connection: conn
            });
            done();
        }).catch(function (err) { return done(err); });
    });
    dashboard_1.default();
    dashlet_1.default();
    after(function () {
    });
});
