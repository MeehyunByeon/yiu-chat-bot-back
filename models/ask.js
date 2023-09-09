const {DataTypes} = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) =>{
    return sequelize.define('Ask', {
        aid : {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        ask: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        check: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('now()')
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()')
        },
    },{
        timestamps: false,
        underscored: false,
        modelName: 'Ask',
        tableName: 'ask',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci ',
    });
}