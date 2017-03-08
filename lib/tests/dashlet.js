"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
var should = require('should');
function default_1() {
    var dashboardCount = 0;
    var maximumLimit = 100;
    describe('dashlet', function () {
        var dashboardId = '', firstDashletId, secondDashletId;
        it('should create a test dashboard for dashlet tests', function () {
            var provider = helper_1.default.provider;
            var model = {
                title: 'Foo title',
                description: 'eewrew',
                createdAt: helper_1.default.utcNow(),
                appid: helper_1.default.appid,
                layout: {
                    moduleId: 'foo'
                },
                user: helper_1.default.testUser,
                config: {},
                id: null,
                shareWith: null
            };
            return provider.createDashboard(model).then(function (result) {
                dashboardId = result.id;
            });
        });
        it('should create a dashlet without config', function () {
            var provider = helper_1.default.provider;
            var createModel = {
                moduleId: 'rss-dashlet',
                title: 'Foo title',
                description: 'eewrew',
                id: "",
                dashboardId: dashboardId,
            };
            return provider.createDashlet(createModel).then(function (result) {
                firstDashletId = result.id;
            });
        });
        it('should create a dashlet with config', function () {
            var provider = helper_1.default.provider;
            var createModel = {
                moduleId: 'rss-dashlet',
                title: 'Foo title',
                description: 'eewrew',
                id: "",
                dashboardId: dashboardId,
                createdAt: helper_1.default.utcNow(),
                configuration: {
                    fooConfig: 'fooValue'
                },
            };
            return provider.createDashlet(createModel).then(function (result) {
                secondDashletId = result.id;
            });
        });
        it('should get dashlets of dashboard', function () {
            var provider = helper_1.default.provider;
            return provider.getDashboard(helper_1.default.appid, dashboardId).then(function (result) {
                should.equal(result.dashlets.length, 2);
            });
        });
        it('should update title of first dashlet', function () {
            var provider = helper_1.default.provider;
            return provider.updateDashlet(firstDashletId, {
                title: 'new title'
            }).then(function (result) {
            });
        });
    });
}
exports.default = default_1;
