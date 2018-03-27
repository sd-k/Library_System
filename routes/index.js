var express = require("express");
var router = express.Router();
var query = require("../db/query.js");
var member_id;
var member_name;

/* GET home page. */
router.get("/home", async function(req, res) {
	var members = await query.getMembersList();
	res.render("index", { members: members });
	res.end();
});

router.get("/member", async function(req, res, next) {
	if (req.query.member != null) member_id = req.query.member;
	member_name = await query.getMemberName(member_id);
	var borrowed_books = await query.getBorrowedBooksDetails(member_id);
	var sent_borrow_request = await query.getPendingBorrowRequests(member_id);
	res.render("member", {
		borrowed_books: borrowed_books,
		sent_borrow_request: sent_borrow_request,
		member_name: member_name
	});
	res.end();
});
router.get("/books", async function(req, res) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	var sent_borrow_request = await query.getPendingBorrowRequests(member_id);
	res.render("borrow_book", {
		available_books: available_books,
		borrowed_books: borrowed_books,
		sent_borrow_request: sent_borrow_request,
		member_name: member_name
	});
	res.end();
});
router.post("/books", function(req, res) {
	var requested_books = Object.keys(req.body);
	var date = query.getDate(new Date(Date.now()));
	query.sendRequestToBorrowBooks(member_id, requested_books, date);
	res.redirect("/member");
	res.end();
});
router.get("/return", async function(req, res, next) {
	var borrowed_books = await query.getBorrowedBooksDetails(member_id);
	var sent_return_request = await query.getPendingReturnRequests(member_id);
	res.render("return_book", {
		borrowed_books: borrowed_books,
		sent_return_request: sent_return_request,
		member_name: member_name
	});
	res.end();
});
router.post("/return", function(req, res) {
	var return_list = Object.keys(req.body);
	var req_date = query.getDate(new Date(Date.now()));
	query.sendReturnRequest(member_id, return_list, req_date);
	res.redirect("/member");
	res.end();
});

router.get("/admin", function(req, res) {
	res.render("admin_home_page");
	res.end();
});
router.get("/admin/borrow", async function(req, res) {
	var pending_borrow_list = await query.getPendingBorrowRequests();
	res.render("admin_pending_borrow", {
		pending_borrow_list: pending_borrow_list
	});
	res.end();
});
router.post("/admin/borrow", function(req, res) {
	var issued_books_details = Object.keys(req.body);
	var book_ids = [];
	var member_ids = [];
	issued_books_details.forEach(function(elem) {
		book_ids.push(elem[1]);
		member_ids.push(elem[3]);
	});
	var issued_on = query.getDate(new Date(Date.now()));
	query.postIssuedBooks(book_ids, member_ids, issued_on);
	res.redirect("/admin");
	res.end();
});

router.get("/admin/return", async function(req, res) {
	var pending_return_list = await query.getPendingReturnRequests();
	res.render("admin_pending_return", {
		pending_return_list: pending_return_list
	});
	res.end();
});
router.post("/admin/return", function(req, res) {
	var return_books_details = Object.keys(req.body);
	var book_ids = [];
	var member_ids = [];
	return_books_details.forEach(function(elem) {
		book_ids.push(elem[1]);
		member_ids.push(elem[3]);
	});
	query.returnedBooks(book_ids, member_ids);
	res.redirect("/admin");
	res.end();
});

module.exports = router;
