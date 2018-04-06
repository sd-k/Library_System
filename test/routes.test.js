const request = require("supertest");
const router = require("../app.js");

describe("Testing login page", () => {
	test("GET", async () => {
		const res = await request(router).get("/home");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/home");
		expect(res.status).toBe(200);
	});
});

describe("Testing member's home page", () => {
	test("GET", async () => {
		const res = await request(router).get("/member");
		expect(res.status).toBe(200);
	});
});

describe("Testing sign up page", () => {
	test("GET", async () => {
		const res = await request(router).get("/signup");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/signup");
		expect(res.status).toBe(200);
	});
});

describe("Testing borrow_book page", () => {
	test("GET", async () => {
		const res = await request(router).get("/books");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/books");
		expect(res.status).toBe(200);
	});
});

describe("Testing return books page", () => {
	test("GET", async () => {
		const res = await request(router).get("/return");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/return");
		expect(res.status).toBe(200);
	});
});

describe("Testing admin's home page", () => {
	test("GET", async () => {
		const res = await request(router).get("/admin");
		expect(res.status).toBe(200);
	});
});

describe("Testing admin's pending borrow page", () => {
	test("GET", async () => {
		const res = await request(router).get("/admin/borrow");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/admin/borrow");
		expect(res.status).toBe(200);
	});
});
describe("Testing admin's pending return page", () => {
	test("GET", async () => {
		const res = await request(router).get("/admin/return");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/admin/return");
		expect(res.status).toBe(200);
	});
});
describe("Testing all books status page", () => {
	test("GET", async () => {
		const res = await request(router).get("/admin/status/books");
		expect(res.status).toBe(200);
	});
});
describe("Testing admin's books updates page", () => {
	test("GET", async () => {
		const res = await request(router).get("/admin/updates/books");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/admin/updates/books");
		expect(res.status).toBe(200);
	});
});
describe("Testing delete books page", () => {
	test("GET", async () => {
		const res = await request(router).get("/admin/updates/books/book");
		expect(res.status).toBe(200);
	});
	test("POST", async () => {
		const res = await request(router).post("/admin/updates/books/book");
		expect(res.status).toBe(200);
	});
});

describe("Testing logout page", () => {
	test("GET", async () => {
		const res = await request(router).get("/logout");
		expect(res.status).toBe(302);
	});
});
