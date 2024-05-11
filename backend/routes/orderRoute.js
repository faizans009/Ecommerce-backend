const express=require("express")
const { isAuthenticated ,authorizeRoles} = require("../middleware/auth")
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../../controllers/orderController")
const router=express.Router()

router.route("/order/new").post(isAuthenticated,createOrder)
router.route("/order/:id").get(isAuthenticated,authorizeRoles("admin"),getSingleOrder)
router.route("/orders/me").get(isAuthenticated,myOrders)
router.route("/admin/orders").get(isAuthenticated,authorizeRoles("admin"),getAllOrders)
router.route("/admin/order/:id").put(isAuthenticated,authorizeRoles("admin"),updateOrder)
.delete(isAuthenticated,authorizeRoles("admin"),deleteOrder)

module.exports=router