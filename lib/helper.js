"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    utcNow: function () {
        var now = new Date();
        var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    }
};
