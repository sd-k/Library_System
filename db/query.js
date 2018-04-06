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
	getMembersList: async function() {
		var members;
		try {
			members = await db.query("select * from members");
		} catch (e) {
			console.log(e);
		}
		return members.rows;
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
			if (!member_id) {
				details = await db.query(
					"select M.member_name,M.member_id,BB.book_id,BB.issued_on,BB.member_id from members M join borrowed_books BB using(member_id) where M.member_id=BB.member_id"
				);
			} else
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
	getPendingBorrowRequests: async function(member_id) {
		var details;
		try {
			if (member_id) {
				details = await db.query(
					"select * from books join borrow_request using(book_id) where member_id=$1",
					[member_id]
				);
			} else
				details = await db.query(
					"select B.book_name,M.member_name,M.member_id,B.book_id,BR.requested_on from books B,members M,borrow_request BR where B.book_id = BR.book_id and M.member_id = BR.member_id"
				);
		} catch (err) {
			console.log(err);
		}
		return details.rows;
	},
	postIssuedBooks: function(book_ids, member_ids, issue_date) {
		try {
			book_ids.forEach(function(book, i) {
				db.query("insert into borrowed_books values($1,$2,$3)", [
					member_ids[i],
					book_ids[i],
					issue_date
				]);
				db.query(
					"delete from borrow_request where member_id=$1 and book_id=$2",
					[member_ids[i], book_ids[i]]
				);
			});
		} catch (e) {
			console.log(e);
		}
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
	getPendingReturnRequests: async function(member_id) {
		var details;
		try {
			if (member_id) {
				details = await db.query(
					"select * from return_request where member_id=$1",
					[member_id]
				);
			} else
				details = await db.query(
					"select B.book_id,B.book_name,M.member_id,M.member_name,RR.requested_on from books B,members M,return_request RR where B.book_id=RR.book_id and M.member_id=RR.member_id"
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
	},
	getMemberNameAndId: async function(mobile_no) {
		var member_name_and_id;
		try {
			member_name_and_id = await db.query(
				"select member_name,member_id from members where mobile_no=$1",
				[mobile_no]
			);
		} catch (e) {
			console.log(e);
		}
		return member_name_and_id.rows[0];
	},
	maxBorrowBooks: async function(member_id) {
		var requested, borrowed;
		try {
			requested = await db.query(
				"select book_id from borrow_request where member_id=$1",
				[member_id]
			);
			borrowed = await db.query(
				"select book_id from borrowed_books where member_id=$1",
				[member_id]
			);
		} catch (e) {
			console.log(e);
		}
		return 3 - (requested.rows.length + borrowed.rows.length);
	},
	insertNewBooks: function(new_book_id, details) {
		try {
			db.query("insert into books (book_id,book_name) values($1,$2)", [
				new_book_id,
				details
			]);
		} catch (e) {
			console.log(e);
		}
	},
	deleteBook: function(book_id) {
		try {
			db.query("delete from books where book_id=$1", [book_id]);
		} catch (e) {
			console.log(e);
		}
	},
	createNewMember: function(details) {
		console.log(details);
		try {
			db.query(
				"insert into members(member_name,mobile_no,password) values($1,$2,$3)",
				[details[0], details[1], details[2]]
			);
		} catch (e) {
			console.log(e);
		}
	}
};
