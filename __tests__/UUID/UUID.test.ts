import { Client } from "pg";

import { UUID } from "../../src";

describe("UUID Class", () => {
	it("should create a uuid from a string", () => {
		const uuid1 = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid1).not.toBeNull();
		const uuid2 = UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(uuid2).not.toBeNull();
	});

	it("should error when creating a uuid from an invalid string", () => {
		expect(() => UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1")).toThrow("Invalid UUID string");
		expect(() => UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A111")).toThrow("Invalid UUID string");
		expect(() => UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1G")).toThrow("Invalid UUID string");
		expect(() => UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1g")).toThrow("Invalid UUID string");
		expect(() => UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1 ")).toThrow("Invalid UUID string");
	});

	it("should create a uuid from a object", () => {
		const uuid = UUID.from({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11" });
		expect(uuid).not.toBeNull();
	});

	it("should error when creating a uuid from an invalid object", () => {
		expect(() => UUID.from({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1" })).toThrow("Invalid UUID object");
		expect(() => UUID.from({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A111" })).toThrow("Invalid UUID object");
		expect(() => UUID.from({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1G" })).toThrow("Invalid UUID object");
		expect(() => UUID.from({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1g" })).toThrow("Invalid UUID object");
		expect(() => UUID.from({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A1 " })).toThrow("Invalid UUID object");
	});

	it("should create a uuid from a newly generated uuid", () => {
		const uuid = UUID.generate();
		expect(uuid).not.toBeNull();
	});

	it("isUUID()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(UUID.isUUID(uuid)).toBe(true);
		expect(UUID.isUUID({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11" })).toBe(false);
	});

	it("toString()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.toString()).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	it("toJSON()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.toJSON()).toEqual({
			uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
		});
	});

	it("equals()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");

		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"))).toBe(true);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11"))).toBe(false);
		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toJSON())).toBe(true);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toJSON())).toBe(false);
		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString())).toBe(true);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toString())).toBe(false);
	});

	it("get uuid", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.uuid).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	it("set uuid", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		uuid.uuid = "A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11";
		expect(uuid.uuid).toBe("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11");
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "uuid.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestuuid (
					uuid uuid NULL,
					_uuid _uuid NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestuuid (uuid, _uuid)
				VALUES (
					'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
					'{A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11, A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestuuid
			`);

			expect(result.rows[0].uuid).toStrictEqual(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"));
			expect(result.rows[0]._uuid).toStrictEqual([UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"), UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11")]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestuuid
		`);

		await client.end();

		if (error) throw error;
	});
});
