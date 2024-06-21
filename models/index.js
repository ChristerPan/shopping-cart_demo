const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
const baseName = path.basename(__filename);
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: process.env.DIALECT,
        define: {
            freezeTableName: true,
        },
        logging: false// 設置為 true 可以看到執行的 SQL 語句
    })

const db = {};
db.sequelize = sequelize;

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf(".") !== 0) && (file !== baseName) && (file.slice(-3) === ".js");
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        //console.log(db);
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
})

module.exports = db;
