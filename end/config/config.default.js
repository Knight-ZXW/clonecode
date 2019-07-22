/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1559713321487_4785';

    config.static = {
        prefix: '/api/public/',
    }
    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true,
            headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
        }
    };

    config.sequelize = {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'probability_analysis',
        username: 'root',
        password: 'ab85275453'
    }

    config.redis={
        client: {
            port: 6379,          // Redis port
            host: 'localhost',   // Redis host
            password: 'ab85275453',
            db: 0,
        },
    };

    config.tokens="tokens"
    config.logger = {
        level: 'ERROR',
    };
    config.validate = {
        convert: false,
        validateRoot: false,
    };
    config.receipt={
        ip:"47.244.237.62"
    }

    return config
};
