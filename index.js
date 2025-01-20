const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const db = require("./models");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
//require('dotenv').config();
require("./strategies/local-strategy");
require("./strategies/google-strategy");
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");




const myStore = new SequelizeStore({
    db: db.sequelize,
    checkExpirationInterval: 1000 * 60,
    expiration: 1000 * 60 * 5
});

app.use(session({
    secret: "donttellanyone",
    saveUninitialized: false,// 強制將未初始化的session存回 session store
    resave: false,// 強制將session存回 session store
    cookie: {
        secure: false,
    },
    store: myStore
}));

(async () => {
    try {
        //force: true 可以確保數據庫結構與模型定義一致，但會刪除所有現有數據。
        //alter: true 可以用來在模型變更後自動調整表結構。
        await db.sequelize.sync({ /*force: true */ });
    }
    catch (err) {
        console.error("db.sequelize.sync error:" + err);
    }
})()


app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res, next) => {
    console.log(`localFlash medhod ${req.method}`);
    console.log(`localFlash originalUrl ${req.originalUrl}`);
    res.locals.success_msg = req.flash("success_msg");
    res.locals.warning_msg = req.flash("warning_msg");
    res.locals.danger_msg = req.flash("danger_msg");;
    next();
})

require("./routes")(app);


app.use((req, res) => {
    console.log("404");
    console.log("req method" + req.method);
    console.log("req originalUrl" + req.originalUrl);
    res.status(404).send("404 Page not found");
});

// 自定義錯誤處理中間件 express原本已有預設的錯誤處理中間件
app.use((err, req, res, next) => {
    console.log("錯誤處理中間件");
    console.error(err.stack); // 打印錯誤堆棧信息到控制台

    res.status(err.status || 500)
        .json({
            error: {
                message: err.message
            }
        });
});

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});

module.exports = app;
