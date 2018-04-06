var express = require("express");
var router = express.Router();
var query = require("../db/query.js");

router.get("/home", async function(req, res) {
	var members = await query.getMembersList();
	res.render("index", { members: members });
	res.end();
});
router.post("/home", async function(req, res) {
	var mobile_no = req.body.mobile_no;
	var password = req.body.password;
	var id_and_name;
	if (mobile_no != null && password != "") {
		id_and_name = await query.getMemberNameAndId(mobile_no);
		var member = {
			member_id: id_and_name.member_id,
			member_name: id_and_name.member_name
		};
		req.session.user = member;
		console.log(req.session.user.member_name);
		req.session.user.member_name == "Admin"
			? res.redirect("/admin")
			: res.redirect("/member");
	} else res.send("<h1>Login Error !!!</h1><p>Goto Login page <a href='/home'>here</a></p>");
	res.end();
});

router.get("/signup", async function(req, res) {
	var members = await query.getMembersList();
	res.render("signup", { members: members });
	res.end();
});
router.post("/signup", function(req, res) {
	var details = [];
	if (req.body.mobile_no) {
		details[0] = req.body.fname.concat(" ", req.body.lname);
		details[1] = Number(req.body.mobile_no);
		details[2] = req.body.confirm_password;
		//query.createNewMember(details);
		res.send(
			"<div align='center'><h2>Successfully Signed up.</h2><br><br> Go to Login page <a href='/home'>here</a><br><br>Or Sign up page <a href='/signup'>here</a></div>"
		);
	} else res.send("<h1>Sign Up Error !!!</h1><p>Goto Sign up page <a href='/home'>here</a></p>");
});

function checkMemberLogIn(req, res, next) {
	if (req.session.user && req.session.user.member_name != "Admin") {
		next();
	} else {
		res.send(
			"<h2>You are not logged in..</h2><p>Login <a href='/home'>here</a></p>"
		);
	}
}
router.get("/member", checkMemberLogIn, async function(req, res, next) {
	var borrowed_books = await query.getBorrowedBooksDetails(
		req.session.user.member_id
	);
	var sent_borrow_request = await query.getPendingBorrowRequests(
		req.session.user.member_id
	);
	var max_borrow = await query.maxBorrowBooks(req.session.user.member_id);
	res.render("member", {
		borrowed_books: borrowed_books,
		sent_borrow_request: sent_borrow_request,
		member_name: req.session.user.member_name,
		max_borrow: max_borrow
	});
	res.end();
});

router.get("/books", checkMemberLogIn, async function(req, res) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	var sent_borrow_request = await query.getPendingBorrowRequests(
		req.session.user.member_id
	);
	var max_borrow = await query.maxBorrowBooks(req.session.user.member_id);
	res.render("borrow_book", {
		available_books: available_books,
		borrowed_books: borrowed_books,
		sent_borrow_request: sent_borrow_request,
		member_name: req.session.user.member_name,
		max_borrow: max_borrow
	});
	res.end();
});
router.post("/books", checkMemberLogIn, async function(req, res) {
	var requested_books = Object.keys(req.body);
	var date = query.getDate(new Date(Date.now()));
	var post = query.sendRequestToBorrowBooks(
		req.session.user.member_id,
		requested_books,
		date
	);
	res.redirect("/member");
	res.end();
});
router.get("/return", checkMemberLogIn, async function(req, res, next) {
	var borrowed_books = await query.getBorrowedBooksDetails(
		req.session.user.member_id
	);
	var sent_return_request = await query.getPendingReturnRequests(
		req.session.user.member_id
	);
	res.render("return_book", {
		borrowed_books: borrowed_books,
		sent_return_request: sent_return_request,
		member_name: req.session.user.member_name
	});
	res.end();
});
router.post("/return", checkMemberLogIn, async function(req, res) {
	var return_list = Object.keys(req.body);
	var req_date = query.getDate(new Date(Date.now()));
	var post = await query.sendReturnRequest(
		req.session.user.member_id,
		return_list,
		req_date
	);
	res.redirect("/member");
	res.end();
});

function checkAdminLogIn(req, res, next) {
	if (req.session.user && req.session.user.member_name == "Admin") {
		next();
	} else {
		res.send(
			"<h2>You are not logged in..</h2><p>Login <a href='/home'>here</a></p>"
		);
	}
}

router.get("/admin", checkAdminLogIn, function(req, res) {
	res.render("admin_home_page");
	res.end();
});
router.get("/admin/borrow", checkAdminLogIn, async function(req, res) {
	var pending_borrow_list = await query.getPendingBorrowRequests();
	var issued_books = await query.getBorrowedBooksDetails();
	res.render("admin_pending_borrow", {
		pending_borrow_list: pending_borrow_list,
		issued_books: issued_books
	});
	res.end();
});
router.post("/admin/borrow", checkAdminLogIn, function(req, res) {
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

router.get("/admin/return", checkAdminLogIn, async function(req, res) {
	var pending_return_list = await query.getPendingReturnRequests();
	res.render("admin_pending_return", {
		pending_return_list: pending_return_list
	});
	res.end();
});
router.post("/admin/return", checkAdminLogIn, async function(req, res) {
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
router.get("/admin/status/books", checkAdminLogIn, async function(req, res) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	res.render("all_books", {
		available_books: available_books,
		borrowed_books: borrowed_books
	});
	res.end();
});

router.get("/admin/updates/books", checkAdminLogIn, async function(req, res) {
	res.render("update_books");
	res.end();
});
router.post("/admin/updates/books", checkAdminLogIn, async function(req, res) {
	var books = await query.getAvailableBooks();
	var new_book_id = books.length + 1;
	var details = Object.values(req.body).join(", ");

	if (details != "") {
		console.log("details", details);
		query.insertNewBooks(new_book_id, details);
	}
	res.redirect("/admin/updates/books");
	res.end();
});
router.get("/admin/updates/books/book", checkAdminLogIn, async function(
	req,
	res
) {
	var available_books = await query.getAvailableBooks();
	var borrowed_books = await query.getBorrowedBooksDetails();
	res.render("delete_book", {
		available_books: available_books,
		borrowed_books: borrowed_books
	});
	res.end();
});
router.post("/admin/updates/books/book", checkAdminLogIn, function(req, res) {
	var book_id = Object.values(req.body)[0];
	query.deleteBook(book_id);
	res.redirect("/admin/updates/books/book");
	res.end();
});

function checkLogIn(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/home");
	}
}
router.get("/logout", checkLogIn, function(req, res) {
	req.session.destroy(function() {
		console.log("member logged out");
	});
	res.redirect("/home");
});
module.exports = router;
