const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// middleware: order exists
function orderExists (req, res, next) { 
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);

    if (foundOrder) { 
        res.locals.order = foundOrder; 
        return next();
    }

    next ({
        status: 404, 
        message: `Order does not exist: ${orderId}`,
    });
}

// middleware: prevent ID overwrite
function idMatchesOrder (req, res, next) { 
    const { orderId } = req.params; 
    const { data: { id } = {} } = req.body;

  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}`,
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
            message: `Order must include a ${property}`,
        });
    }
}

// middleware: validate dishes array 
function dishesIsValid (req, res, next) { 
    const { data: { dishes } = {} } = req.body;

    if (!Array.isArray(dishes) || dishes.length === 0) { 
        return next ({
            status: 400, 
            message: "Order must include at least one dish",
        });
    }

for (let index = 0; index < dishes.length; index++) { 
    const { quantity } = dishes[index];

    if (!Number.isInteger(quantity) || quantity <= 0) { 
        return next ({ 
            status: 400, 
            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
        }); 
    }
    }
    next();
}

// middleware: validate status
function statusIsValid (req, res, next) { 
    const { data: { status } = {} } = req.body; 

    const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];

    if (validStatus.includes(status)) return next();

    next ({ 
        status: 400,
        message: "Order must have a valid status",
    });
}

// middleware: restricts delete to pending only
function statusIsPending(req, res, next) {
  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }

  next();
}

// GET /orders
function list (req, res) { 
    res.json({ data: orders });
}

// GET /orders/:orderId
function read (req, res) { 
    res.json({ data: res.locals.order });
}

// POST /orders
function create (req, res) { 
    const { data: { deliverTo, mobileNumber, dishes }, } = req.body; 

    const newOrder = { 
        id: nextId(), 
        deliverTo, 
        mobileNumber, 
        status: "pending", 
        dishes,
    };

    orders.push(newOrder); 
    res.status(201).json({ data: newOrder });
}

// PUT /orders/:orderId
function update (req, res) { 
    const order = res.locals.order;
    const { data } = req.body; 

    order.deliverTo = data.deliverTo; 
    order.mobileNumber = data.mobileNumber; 
    order.status = data.status; 
    order.dishes = data.dishes; 

    res.json({ data : order });
}

// DELETE /orders/:orderId 
function destroy (req, res) { 
    const index = orders.findIndex(
        (order) => order.id === res.locals.order.id
    );

    orders.splice(index, 1); 
    res.sendStatus(204);
}

module.exports = {
  list,
  read: [orderExists, read],
  create: [
    bodyHasData("deliverTo"),
    bodyHasData("mobileNumber"),
    bodyHasData("dishes"),
    dishesIsValid,
    create,
  ],
  update: [
    orderExists,
    idMatchesOrder,
    bodyHasData("deliverTo"),
    bodyHasData("mobileNumber"),
    bodyHasData("status"),
    bodyHasData("dishes"),
    dishesIsValid,
    statusIsValid,
    update,
  ],
  delete: [orderExists, statusIsPending, destroy],
};



