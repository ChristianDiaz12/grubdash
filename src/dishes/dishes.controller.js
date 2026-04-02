const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// middleware: checks if a dish exists 
function dishExists (req, res, next) { 
    const { dishId } = req.params;

    const foundDish = dishes.find((dish) => dish.id === dishId); 

    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }

    next ({
        status: 404, 
        message: `Dish does not exist: ${dishId}`,
    });
}

// middleware: prevent ID overwrite
function idMatchesDish (req, res, next) { 
    const { dishId } = req.params; 
    const { data: { id } = {} } = req.body; 

    if (id && id !== dishId) { 
        return next ({ 
            status: 400, 
            message: `Dish id does not match route id. Dish: ${id}`,
        });
    }
    next();
}

// middleware: reusable for required fields
function bodyHasData (property) { 
    return function (req, res, next) { 
        const { data = {} } = req.body;

        if (data[property]) return next();

        next ({ 
            status: 400, 
            message: `Dish must include a ${property}`,
        });
    };
}

// middleware: validate price
function priceIsValid (req, res, next) { 
    const { data: { price } = {} } = req.body;

    if (Number.isInteger(price) && price > 0) return next(); 

    next ({ 
        status: 400, 
        message: "Dish must have a price that is an integer greater than 0",
    });
}

// GET /dishes
function list (req, res) { 
    res.json({ data: dishes }); 
}

// GET /dishes/:dishId
function read (req, res) { 
    res.json({ data: res.locals.dish });
}

// POST /dishes
function create (req, res) { 
    const { data } = req.body; 

    const newDish = { 
        id: nextId(),
        name: data.name,
        description: data.description, 
        price: data.price,
        image_url: data.image_url,
    };

    dishes.push(newDish);
    res.status(201).json({ data: newDish }); 
}

// PUT /dishes/:dishId
function update(req, res) { 
    const dish = res.locals.dish; 
    const { data } = req.body;

    dish.name = data.name; 
    dish.description = data.description; 
    dish.price = data.price; 
    dish.image_url = data.image_url; 

    res.json({ data: dish });
}

module.exports = { 
    list, 
    read: [dishExists, read], 
    create: [
        bodyHasData("name"), 
        bodyHasData("description"), 
        bodyHasData("price"), 
        bodyHasData("image_url"), 
        priceIsValid, 
        create,
    ], 
    update: [
        dishExists,
        idMatchesDish,
        bodyHasData("name"), 
        bodyHasData("description"), 
        bodyHasData("price"), 
        bodyHasData("image_url"), 
        priceIsValid,
        update,
    ],
};

