import { DashletCreateModel } from 'jdash-core/lib/definitions';
import { DashboardModel, DashletModel, DashboardCreateModel } from 'jdash-core';
import * as mocha from 'mocha';

import Helper from './helper';
import * as jcore from 'jdash-core';
var should = require('should');

export default function () {
    var dashboardCount = 0;
    var maximumLimit = 100;
    describe('dashlet', function () {
        var dashboardId = '', firstDashletId, secondDashletId;
        it('should create a test dashboard for dashlet tests', function () {
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
                dashboardId = result.id
            })
        });

        it('should create a dashlet without config', function () {
            var provider = Helper.provider;
            var createModel: DashletCreateModel = {
                moduleId: 'rss-dashlet',
                title: 'Foo title',
                description: 'eewrew',
                id: "",
                dashboardId: dashboardId,
            };

            return provider.createDashlet(createModel).then(result => {
                firstDashletId = result.id;
            })
        });

        it('should create a dashlet with config', function () {
            var provider = Helper.provider;
            var createModel: DashletModel = {
                moduleId: 'rss-dashlet',
                title: 'Foo title',
                description: 'eewrew',
                id: "",
                dashboardId: dashboardId,
                createdAt: Helper.utcNow(),
                configuration: {
                    fooConfig: 'fooValue'
                },
            };


            return provider.createDashlet(createModel).then(result => {
                secondDashletId = result.id;
            })
        });

        it('should get dashlets of dashboard', function () {
            var provider = Helper.provider;
            return provider.getDashboard(Helper.appid, dashboardId).then(result => {
                result.dashlets["should"].have.property('length').be.eql(2);
            })
        });

        it('should update title of first dashlet', function () {
            var provider = Helper.provider;
            return provider.updateDashlet(firstDashletId, {
                title: 'new title'
            }).then(result => {

            })
        });

    });
}