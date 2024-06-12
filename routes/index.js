const userRouter = require("./modules/user");

module.exports = (app) => {
    app.use("/user", userRouter);
}