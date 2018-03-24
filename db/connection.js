const pg = require("pg");
const connectionString = "postgresql://localhost/library_system";

var db = new pg.Pool({
	connectionString: connectionString
});

db.connect(err => {
	if (err) console.error(err);
});

exports.db = db;
