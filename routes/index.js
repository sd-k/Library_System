var express = require("express");
var router = express.Router();
var query = require("../db/query.js");

/* GET home page. */
router.get("/", async function(req, res, next) {
	var details = await query.getBorrowedBooksDetails();
	res.render("index", { details: details });
	res.end();
});
//
router.get("/borrow", async function(req, res) {
	var available_books = await query.getAvailableBooks();
	res.render("borrow_book", { books: available_books });
	res.end();
});
router.post("/borrow", function(req, res) {
	var requested_books = Object.keys(req.body);
	if (requested_books.length == 0) res.send("No borrow request received...");
	query.sendRequestToBorrowBooks("0001", "Sougata", requested_books);
	res.send("Request received.....");
	res.end();
});
router.get("/return", async function(req, res, next) {
	var borrowed_books = await query.getBorrowedBooksDetails();
	res.render("return_book", { borrowed_books: borrowed_books });
	res.end();
});
router.post("/return", function(req, res) {
	var return_request = Object.keys(req.body);
	if (return_request.length == 0) res.send("No return request received...");
	query.sendReturnRequest("0020", "sougata", return_request);
	res.send("Request received.....");
	res.end();
});

router.get("/admin", function(req, res) {
	res.render("admin_home_page");
	res.end();
});
router.get("/admin/pending_borrow_request", async function(req, res) {
	var pending_borrow_list = await query.getPendingBorrowRequests();
	if (pending_borrow_list.length == 0) res.send("No pending requests...");
	res.render("admin_pending_borrow", {
		pending_borrow_list: pending_borrow_list
	});
	res.end();
});
router.post("/admin/pending_borrow_request", async function(req, res) {
	res.send("Database updated...");
	res.end();
});

router.get("/admin/pending_return_request", async function(req, res) {
	var pending_return_list = await query.getPendingReturnRequests();
	res.render("admin_pending_return", {
		pending_return_list: pending_return_list
	});
	res.end();
});
router.post("/admin/pending_return_request", async function(req, res) {
	res.send("Database updated...");
	res.end();
});

module.exports = router;
