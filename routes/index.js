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
router.post("/home", function(req, res) {
	member_id = parseInt(Object.values(req.body)[0]);
	res.redirect("/member");
	res.end();
});
router.get("/member", async function(req, res, next) {
	member_name = await query.getMemberName(member_id);
	var borrowed_books = await query.getBorrowedBooksDetails(member_id);
	var sent_borrow_request = await query.getPendingBorrowRequests(member_id);
	var max_borrow = await query.maxBorrowBooks(member_id);
	res.render("member", {
		borrowed_books: borrowed_books,
		sent_borrow_request: sent_borrow_request,
		member_name: member_name,
		max_borrow: max_borrow
	});
	res.end();
});

router.get("/books", async function(req, res) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	var sent_borrow_request = await query.getPendingBorrowRequests(member_id);
	var max_borrow = await query.maxBorrowBooks(member_id);
	res.render("borrow_book", {
		available_books: available_books,
		borrowed_books: borrowed_books,
		sent_borrow_request: sent_borrow_request,
		member_name: member_name,
		max_borrow: max_borrow
	});
	res.end();
});
router.post("/books", async function(req, res) {
	var requested_books = Object.keys(req.body);
	var date = query.getDate(new Date(Date.now()));
	var post = query.sendRequestToBorrowBooks(member_id, requested_books, date);
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
router.post("/return", async function(req, res) {
	var return_list = Object.keys(req.body);
	var req_date = query.getDate(new Date(Date.now()));
	var post = await query.sendReturnRequest(member_id, return_list, req_date);
	res.redirect("/member");
	res.end();
});

router.get("/admin", function(req, res) {
	res.render("admin_home_page");
	res.end();
});
router.get("/admin/borrow", async function(req, res) {
	var pending_borrow_list = await query.getPendingBorrowRequests();
	var issued_books = await query.getBorrowedBooksDetails();
	res.render("admin_pending_borrow", {
		pending_borrow_list: pending_borrow_list,
		issued_books: issued_books
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
router.post("/admin/return", async function(req, res) {
	var return_books_details = Object.keys(req.body);
	var book_ids = [];
	var member_ids = [];
	return_books_details.forEach(function(elem) {
		book_ids.push(elem[1]);
		member_ids.push(elem[3]);
	});
	var post = await query.returnedBooks(book_ids, member_ids);
	res.redirect("/admin");
	res.end();
});
router.get("/admin/status/books", async function(req, res) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	res.render("all_books", {
		available_books: available_books,
		borrowed_books: borrowed_books
	});
	res.end();
});

router.get("/admin/updates/books", function(req, res) {
	res.render("update_books");
	res.end();
});
router.post("/admin/updates/books", function(req, res) {
	var details = Object.values(req.body).join(", ");
	console.log(details);
	query.insertNewBooks(details);
	res.redirect("/admin/updates/books");
	res.end();
});
router.get("/admin/updates/books/book", async function(req, res) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	res.render("delete_book", {
		available_books: available_books,
		borrowed_books: borrowed_books
	});
	res.end();
});
router.post("/admin/updates/books/book", function(req, res) {
	var book_id = parseInt(Object.values(req.body)[0]);
	console.log(book_id);
	query.deleteBook(book_id);
	res.redirect("/admin/updates/books/book");
	res.end();
});
module.exports = router;
