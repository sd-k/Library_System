var express = require("express");
var router = express.Router();
var query = require("../db/query.js");

/* GET home page. */

router.get("/", async function(req, res, next) {
	var books = await query.getBorrowedBooksDetails(3);
	res.render("index", { books: books });
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
	var date = query.getDate(new Date(Date.now()));
	if (requested_books.length == 0) res.send("No borrow request received...");
	query.sendRequestToBorrowBooks(3, requested_books, date);
	res.send("Request received.....");
	res.end();
});
router.get("/return", async function(req, res, next) {
	var borrowed_books = await query.getBorrowedBooksDetails(3);
	console.log(borrowed_books);
	res.render("return_book", { borrowed_books: borrowed_books });
	res.end();
});
router.post("/return", function(req, res) {
	var return_list = Object.keys(req.body);
	if (return_list.length == 0) res.send("No return request received...");
	else {
		var req_date = query.getDate(new Date(Date.now()));
		console.log(return_list);
		query.sendReturnRequest(3, return_list, req_date);
		res.send("Request received.....");
		res.end();
	}
});

router.get("/admin", function(req, res) {
	res.render("admin_home_page");
	res.end();
});
router.get("/admin/pending_borrow_request", async function(req, res) {
	var pending_borrow_list = await query.getPendingBorrowRequests();
	res.render("admin_pending_borrow", {
		pending_borrow_list: pending_borrow_list
	});
	res.end();
});
router.post("/admin/pending_borrow_request", function(req, res) {
	var issued_books_details = Object.keys(req.body);
	if (issued_books_details.length == 0) res.send("No book issued ...");
	var book_ids = [];
	var member_ids = [];
	issued_books_details.forEach(function(elem) {
		book_ids.push(elem[1]);
		member_ids.push(elem[3]);
	});
	var issued_on = query.getDate(new Date(Date.now()));
	var message = issued_books_details.length.toString() + " book(s) issued...";
	query.postIssuedBooks(book_ids, member_ids, issued_on);
	res.send(message);
	res.end();
});

router.get("/admin/pending_return_request", async function(req, res) {
	var pending_return_list = await query.getPendingReturnRequests();
	res.render("admin_pending_return", {
		pending_return_list: pending_return_list
	});
	res.end();
});
router.post("/admin/pending_return_request", function(req, res) {
	var return_books_details = Object.keys(req.body);
	if (return_books_details.length > 0) {
		var book_ids = [];
		var member_ids = [];
		return_books_details.forEach(function(elem) {
			book_ids.push(elem[1]);
			member_ids.push(elem[3]);
		});
		var message =
			return_books_details.length.toString() + " book(s) returned...";
		query.returnedBooks(book_ids, member_ids);
		res.send(message);
	} else res.send("No book issued ...");
	res.end();
});

module.exports = router;
