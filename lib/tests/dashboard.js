"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
var should = require('should');
function default_1() {
    var dashboardCount = 0;
    var maximumLimit = 100;
    describe('dashboard', function () {
        it('should create a dashboard', function () {
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
                dashboardCount++;
            });
        });
        it('should populate 100 dashboards for user', function () {
            var provider = helper_1.default.provider;
            var promises = [];
            for (var i = 0; i < 100; i++) {
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
                promises.push(provider.createDashboard(model));
            }
            return Promise.all(promises).then(function () {
                dashboardCount += promises.length;
            });
        });
        it('should create and gets the dashboard', function () {
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
                dashboardCount++;
                return provider.getDashboard(helper_1.default.appid, result.id);
            });
        });
        it('should get users dashboards all', function () {
            var provider = helper_1.default.provider;
            return provider.searchDashboards({
                appid: helper_1.default.appid,
                user: helper_1.default.testUser
            }).then(function (dashes) {
                should.equal(dashes.data.length, maximumLimit);
                should.equal(dashes.hasMore, true);
            });
        });
        it('should get users first 5 dashboards', function () {
            var provider = helper_1.default.provider;
            return provider.searchDashboards({
                appid: helper_1.default.appid,
                user: helper_1.default.testUser
            }, { limit: 5, startFrom: 0 }).then(function (dashes) {
                should.equal(dashes.data.length, 5);
                should.equal(dashes.hasMore, true);
            });
        });
        it('should get users first 15 dashboards', function () {
            var provider = helper_1.default.provider;
            return provider.searchDashboards({
                appid: helper_1.default.appid,
                user: helper_1.default.testUser
            }, { limit: 15, startFrom: 0 }).then(function (dashes) {
                should.equal(dashes.data.length, 15);
                should.equal(dashes.hasMore, true);
            });
        });
        it('should have more dashboards', function () {
            var provider = helper_1.default.provider;
            return provider.searchDashboards({
                appid: helper_1.default.appid,
                user: helper_1.default.testUser
            }, { limit: 50, startFrom: 0 }).then(function (dashes) {
                should.equal(dashes.data.length, 50);
                should.equal(dashes.hasMore, true);
            });
        });
        it('should get users first 20 dashboard from start index 90', function () {
            var provider = helper_1.default.provider;
            return provider.searchDashboards({
                appid: helper_1.default.appid,
                user: helper_1.default.testUser
            }, { limit: 20, startFrom: 90 }).then(function (dashes) {
                should.equal(dashes.data.length, 12);
                should.equal(dashes.hasMore, false);
            });
        });
    });
}
exports.default = default_1;
