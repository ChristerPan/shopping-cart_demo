module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user",
        {
            username: { type: DataTypes.STRING, allowNull: false, uniqne: true },
            password: { type: DataTypes.STRING, allowNull: false }
        }
    );

    //User.removeAttribute('id');

    return User;
};