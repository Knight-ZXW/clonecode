'use strict';

/** @type Egg.EggPlugin */
module.exports = {

    sequelize: {
        enable: true,
        package: 'egg-sequelize',
    },
    validate: {
        enable: true,
        package: 'egg-validate',
    },
    redis: {
        enable: true,
        package: 'egg-redis',
    }

};
