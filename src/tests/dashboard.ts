import { DashboardModel, DashboardCreateModel } from 'jdash-core';
import * as mocha from 'mocha';

import Helper from './helper';
import * as jcore from 'jdash-core';

var should = require('should');

export default function () {
    var dashboardCount = 0;
    var maximumLimit = 100;
    describe('dashboard', function () {
        it('should create a dashboard', function () {
            var provider = Helper.provider;
            var model: DashboardModel = {
                title: 'Foo title',
                description: 'eewrew',
                createdAt: Helper.utcNow(),
                appid: Helper.appid,
                layout: {
                    moduleId: 'foo'
                },
                user: Helper.testUser,
                config: {},
                id: null,
                shareWith: null
            };

            return provider.createDashboard(model).then(result => {
                dashboardCount++;
            })
        });

        it('should populate 100 dashboards for user', function () {
            var provider = Helper.provider;
            var promises = [];
            for (var i = 0; i < 100; i++) {
                var model: DashboardModel = {
                    title: 'Foo title',
                    description: 'eewrew',
                    createdAt: Helper.utcNow(),
                    appid: Helper.appid,
                    layout: {
                        moduleId: 'foo'
                    },
                    user: Helper.testUser,
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
            var provider = Helper.provider;
            var model: DashboardModel = {
                title: 'Foo title',
                description: 'eewrew',
                createdAt: Helper.utcNow(),
                appid: Helper.appid,
                layout: {
                    moduleId: 'foo'
                },
                user: Helper.testUser,
                config: {},
                id: null,
                shareWith: null
            };

            return provider.createDashboard(model).then(result => {
                dashboardCount++;
                return provider.getDashboard(Helper.appid, result.id);
            })
        });

        it('should get users dashboards all', function () {
            var provider = Helper.provider;
            return provider.searchDashboards({
                appid: Helper.appid,
                user: Helper.testUser
            }).then((dashes) => {
                should.equal(dashes.data.length, maximumLimit);
                should.equal(dashes.hasMore, true);
            });
        });

        it('should get users first 5 dashboards', function () {
            var provider = Helper.provider;
            return provider.searchDashboards({
                appid: Helper.appid,
                user: Helper.testUser
            }, { limit: 5, startFrom: 0 }).then((dashes) => {
                should.equal(dashes.data.length, 5);
                should.equal(dashes.hasMore, true);
            });
        });
        it('should get users first 15 dashboards', function () {
            var provider = Helper.provider;
            return provider.searchDashboards({
                appid: Helper.appid,
                user: Helper.testUser
            }, { limit: 15, startFrom: 0 }).then((dashes) => {
                should.equal(dashes.data.length, 15);
                should.equal(dashes.hasMore, true);
            });
        });

        it('should have more dashboards', function () {
            var provider = Helper.provider;

            return provider.searchDashboards({
                appid: Helper.appid,
                user: Helper.testUser
            }, { limit: 50, startFrom: 0 }).then((dashes) => {
                should.equal(dashes.data.length, 50);
                should.equal(dashes.hasMore, true);
            });
        });

        it('should get users first 20 dashboard from start index 90', function () {
            var provider = Helper.provider;
            return provider.searchDashboards({
                appid: Helper.appid,
                user: Helper.testUser
            }, { limit: 20, startFrom: 90 }).then((dashes) => {
                should.equal(dashes.data.length, 12);
                should.equal(dashes.hasMore, false);
            });
        });
    });
}