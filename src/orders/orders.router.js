const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// router for /orders
router
.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

// router for /orders/:orderId
router
.route("/:orderId")
.get(controller.read)
.put(controller.update)
.delete(controller.delete)
.all(methodNotAllowed);

module.exports = router;
