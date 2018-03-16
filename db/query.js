const db = require("./connection.js").db;

module.exports = {
	getAvailableBooks: async function() {
		let books;
		try {
			books = await db.query("select * from books");
		} catch (err) {
			console.log(err);
		}
		return books.rows.map(row => row.book_name);
	},
	getBorrowedBooksDetails: async function() {
		var details;
		try {
			details = await db.query(
				"select * from borrowed_books where member_name='Sougata'"
			);
		} catch (err) {
			console.log(err);
		}
		return details.rows[0];
	},
	sendRequestToBorrowBooks: function(id, name, requested_books) {
		if (requested_books.length == 1)
			db.query(
				"Insert into borrow_request(member_id,member_name,book1) values($1,$2,$3)",
				[id, name, requested_books[0]]
			);
		else if (requested_books.length == 2)
			db.query(
				"Insert into borrow_request(member_id,member_name,book1,book2) values($1,$2,$3,$4)",
				[id, name, requested_books[0], requested_books[1]]
			);
		else if (requested_books.length == 3)
			db.query(
				"Insert into borrow_request(member_id,member_name,book1,book2,book3) values($1,$2,$3,$4,$5)",
				[
					id,
					name,
					requested_books[0],
					requested_books[1],
					requested_books[2]
				]
			);
	},
	getPendingBorrowRequests: async function() {
		var requests;
		try {
			requests = await db.query("select * from borrow_request");
		} catch (err) {
			console.log(err);
		}
		var books = [];
		requests.rows.forEach(function() {
			books.push(requests.rows.map(row => row.book1));
			books.push(requests.rows.map(row => row.book2));
			books.push(requests.rows.map(row => row.book3));
		});
		return books[0]
			.concat(books[1])
			.concat(books[2])
			.filter(book => book != null);
	},
	sendReturnRequest: function(id, name, requested_books) {
		if (requested_books.length == 1)
			db.query(
				"Insert into return_request(member_id,member_name,book1) values($1,$2,$3)",
				[id, name, requested_books[0]]
			);
		else if (requested_books.length == 2)
			db.query(
				"Insert into return_request(member_id,member_name,book1,book2) values($1,$2,$3,$4)",
				[id, name, requested_books[0], requested_books[1]]
			);
		else if (requested_books.length == 3)
			db.query(
				"Insert into return_request(member_id,member_name,book1,book2,book3) values($1,$2,$3,$4,$5)",
				[
					id,
					name,
					requested_books[0],
					requested_books[1],
					requested_books[2]
				]
			);
	},
	getPendingReturnRequests: async function() {
		var requests;
		try {
			requests = await db.query("select * from return_request");
		} catch (err) {
			console.log(err);
		}
		var books = [];
		requests.rows.forEach(function() {
			books.push(requests.rows.map(row => row.book1));
			books.push(requests.rows.map(row => row.book2));
			books.push(requests.rows.map(row => row.book3));
		});
		return books[0]
			.concat(books[1])
			.concat(books[2])
			.filter(book => book != null);
	}
};
