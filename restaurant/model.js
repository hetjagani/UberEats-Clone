const { DataTypes } = require("sequelize");

const Restaurant = global.DB.define("restaurants", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
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
    time_open: {
        type: DataTypes.TIME,
    },
    time_close: {
        type: DataTypes.TIME,
    },
    food_type: {
        type: DataTypes.ENUM("veg", "non-veg", "vegan"),
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

const Dish = global.DB.define("dishes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    food_type: {
        type: DataTypes.ENUM("veg", "non-veg", "vegan"),
    },
});

const Category = global.DB.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
});

const Ingredient = global.DB.define("ingrediants", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
});

Restaurant.belongsToMany(Media, { through: "restaurant_media" });
Media.belongsToMany(Restaurant, { through: "restaurant_media" });

Restaurant.hasMany(Dish, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Dish.belongsTo(Restaurant);

Dish.belongsToMany(Category, { through: "dish_categories" });
Category.belongsToMany(Dish, { through: "dish_categories" });

Dish.belongsToMany(Media, { through: "dish_media" });
Media.belongsToMany(Dish, { through: "dish_media" });

Dish.hasMany(Ingredient, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Ingredient.belongsTo(Dish);

const runMigration = async () => {
    if (!global.DB) {
        return Promise.reject("please initialize DB");
    }
    global.DB.sync({ alter: true });

    Category.findOrCreate({ where: { name: "Appetizer" }, defaults: { name: "Appetizer" } });
    Category.findOrCreate({ where: { name: "Salad" }, defaults: { name: "Salad" } });
    Category.findOrCreate({ where: { name: "Main Course" }, defaults: { name: "Main Course" } });
    Category.findOrCreate({ where: { name: "Dessert" }, defaults: { name: "Dessert" } });
    Category.findOrCreate({ where: { name: "Beverage" }, defaults: { name: "Beverage" } });
};

module.exports = { Restaurant, Media, runMigration };
