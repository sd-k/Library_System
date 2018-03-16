const pg = require("pg");
const connectionString = "postgresql://localhost/library";

var pool = new pg.Pool({
	connectionString: connectionString
});
pool.connect(err => {
	console.error(err);
});

exports module pool;

// pool.query("select * from books", getBookList);
//
// var getBookList = function(err, list) {
// 	if (err) console.error(err);
// 	var books = [];
// 	books = list.rows;
// 	books.forEach(function(row) {
// 		console.log(row.book_name);
// 	});
// };
