const { DataTypes } = require("sequelize");

const Customer = global.DB.define("customers", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    nickname: {
        type: DataTypes.STRING,
    },
    about: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    contact_no: {
        type: DataTypes.STRING,
    },
});

const Media = global.DB.define("media", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    url: {
        type: DataTypes.STRING,
    },
    alt_text: {
        type: DataTypes.STRING,
    },
});

const Favourite = global.DB.define("favourites", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    restaurantId: {
        type: DataTypes.INTEGER,
    },
});

Media.hasMany(Customer, {
    onDelete: "SET NULL",
});
Customer.belongsTo(Media);

Customer.hasMany(Favourite, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Favourite.belongsTo(Customer);

const runMigration = async () => {
    if (!global.DB) {
        return Promise.reject("please initialize DB");
    }
    global.DB.sync({ alter: true });
};

module.exports = { Customer, Media, Favourite, runMigration };
