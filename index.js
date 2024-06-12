const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(session({
    secret: "donttellanyone",// 強制將未初始化的session存回 session store
    saveUninitialized: false,// 強制將session存回 session store
    resave: false,
    cookie: {
        secure: false,
    }
}));

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use((req, res, next) => {
    //console.log(`localFlash medhod ${req.method}`);
    //console.log(`localFlash originalUrl ${req.originalUrl}`);
    res.locals.success_msg = req.flash("success_msg");
    res.locals.warning_msg = req.flash("warning_msg");
    res.locals.danger_msg = req.flash("danger_msg");;
    next();
})



const port = process.env.PORT || 3000;



require("./routes")(app);

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
