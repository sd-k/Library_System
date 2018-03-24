const db = require("./connection.js").db;

module.exports = {
	getDate: function(date) {
		var dd = date.getDate();
		var mm = date.getMonth() + 1;
		var yyyy = date.getFullYear();
		if (dd < 10) dd = "0" + dd;
		if (mm < 10) mm = "0" + mm;
		return dd + "/" + mm + "/" + yyyy;
	},
	getAvailableBooks: async function() {
		let books;
		try {
			books = await db.query("select * from books");
		} catch (err) {
			console.log(err);
		}
		return books.rows;
	},
	getBorrowedBooksDetails: async function(member_id) {
		var details;
		try {
			details = await db.query(
				"select b.book_name,bb.issued_on,b.book_id from books b join borrowed_books bb using(book_id) where bb.member_id = $1",
				[member_id]
			);
		} catch (err) {
			console.log(err);
		}
		return details.rows;
	},
	sendRequestToBorrowBooks: function(member_id, requested_books, req_date) {
		requested_books.forEach(function(book_id) {
			parseInt(book_id);
			db.query("insert into borrow_request values($1,$2,$3)", [
				member_id,
				book_id,
				req_date
			]);
		});
	},
	getPendingBorrowRequests: async function() {
		var details;
		try {
			details = await db.query(
				"select B.book_name,M.member_name,M.member_id,B.book_id from books B,members M,borrow_request BR where B.book_id = BR.book_id and M.member_id = BR.member_id"
			);
		} catch (err) {
			console.log(err);
		}
		return details.rows;
	},
	postIssuedBooks: async function(book_ids, member_ids, issue_date) {
		book_ids.forEach(function(book, i) {
			db.query("insert into borrowed_books values($1,$2,$3)", [
				member_ids[i],
				book_ids[i],
				issue_date
			]);
			db.query("delete from borrow_request where book_id = $1", [
				book_ids[i]
			]);
		});
	},

	sendReturnRequest: function(member_id, return_list, req_date) {
		return_list.forEach(function(book_id) {
			db.query("insert into return_request values ($1,$2,$3)", [
				member_id,
				book_id,
				req_date
			]);
		});
	},
	getPendingReturnRequests: async function() {
		var details;
		try {
			details = await db.query(
				"select B.book_id,B.book_name,M.member_id,M.member_name from books B,members M,return_request RR where B.book_id=RR.book_id and M.member_id=RR.member_id"
			);
		} catch (e) {
			console.log(e);
		}
		return details.rows;
	},
	returnedBooks: function(book_ids, member_ids) {
		book_ids.forEach(function(book_id, i) {
			db.query("delete from borrowed_books where book_id = $1", [
				book_ids[i]
			]);
			db.query("delete from return_request where book_id = $1", [
				book_ids[i]
			]);
		});
	}
};
