const { DataTypes } = require("sequelize");

const User = global.DB.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("customer", "restaurant"),
    },
});

const runMigration = async () => {
    if (!global.DB) {
        return Promise.reject("please initialize DB");
    }
    User.sync();
};

module.exports = { User, runMigration };
