const Order = require("./../models/order");
const fs = require("fs");
const { rootDir, path } = require("./../utils/path");
const PDFDocument = require("pdfkit");

const createOrder = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const items = req.user.cart.items;
    const order = new Order({
      userId,
      items,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    let orders = await Order.find({ userId })
      .populate("items.productId")
      .exec();
    for (let order of orders) {
      let orderCost = 0;
      for (let item of order.items) {
        orderCost += item.quantity * item.productId.price;
        order.orderCost = orderCost;
      }
    }
    res.render("./shop/orders", {
      path: "/orders",
      docTitle: "My orders",
      orders,
      isAuthenticated: req.session.loggedIn,
    });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    // We will check if order id exists and if so, it belongs to current user
    const { _id: userId } = req.user;
    let orderID = req.params.orderID;
    const orderData = await Order.find({ userId, _id: orderID })
      .populate("items.productId")
      .exec();
    const currentOrder = orderData[0];
    if (currentOrder && currentOrder.userId.toString() === userId.toString()) {
      const invoiceName = `invoice-${orderID}.pdf`;
      const invoicePath = path.join(rootDir, "invoices", invoiceName);
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      pdfDoc.pipe(res);
      pdfDoc.fontSize(16).text(`INVOICE`, { underline: true, align: "center" });
      pdfDoc.moveDown();
      pdfDoc.fontSize(12).text(`Order details #${orderID}`);
      pdfDoc.moveDown();
      let totalPrice = 0;
      for (let item of currentOrder.items) {
        totalPrice += item.quantity * item.productId.price;
        pdfDoc
          .fontSize(12)
          .text(
            `${item.productId.title} : ${item.quantity} X ${
              item.productId.price
            } = ${item.quantity * item.productId.price}`
          );
      }
      pdfDoc.moveDown();
      pdfDoc.fontSize(12).text(`Total price is: ${totalPrice}`);
      pdfDoc.end();
    } else {
      const error = new Error("Forbidden");
      error.httpStatusCode = 500;
      return next(error);
    }
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports = { createOrder, getOrders, getInvoice };
