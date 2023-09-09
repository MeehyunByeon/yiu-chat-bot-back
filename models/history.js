const {DataTypes} = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) =>{
    return sequelize.define('History', {
        hid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        question: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('now()')
        },
    },{
        timestamps: false,
        underscored: false,
        modelName: 'History',
        tableName: 'history',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci ',
    });
}