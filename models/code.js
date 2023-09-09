const {DataTypes} = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) =>{
    return sequelize.define('Code', {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        top: {
            type: Sequelize.CHAR(255),
            allowNull: true,
        },
        mid: {
            type: Sequelize.CHAR(255),
            allowNull: true,
        },
        bot: {
            type: Sequelize.CHAR(255),
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
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
        modelName: 'Code',
        tableName: 'code',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci ',
    });
}