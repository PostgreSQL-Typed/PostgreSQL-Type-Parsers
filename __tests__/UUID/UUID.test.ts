import { Client } from "pg";

import { UUID } from "../../src";

describe("UUID Class", () => {
	it("should create a uuid from a string", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid).not.toBeNull();
	});

	it("should create a uuid from a object", () => {
		const uuid = UUID.from({ UUID: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11" });
		expect(uuid).not.toBeNull();
	});

	it("should create a uuid from a newly generated uuid", () => {
		const uuid = UUID.generate();
		expect(uuid).not.toBeNull();
	});

	it("isUUID()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(UUID.isUUID(uuid)).toBe(true);
		expect(UUID.isUUID({ UUID: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11" })).toBe(
			false
		);
	});

	it("toString()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.toString()).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	it("toJSON()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.toJSON()).toEqual({
			UUID: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
		});
	});

	it("equals()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");

		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"))).toBe(
			true
		);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11"))).toBe(
			false
		);
		expect(
			uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toJSON())
		).toBe(true);
		expect(
			uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toJSON())
		).toBe(false);
		expect(
			uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString())
		).toBe(true);
		expect(
			uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toString())
		).toBe(false);
	});

	it("get UUID", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.UUID).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	it("set UUID", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		uuid.UUID = "A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11";
		expect(uuid.UUID).toBe("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11");
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "uuid.test.ts"
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

			expect(result.rows[0].uuid).toStrictEqual(
				UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")
			);
			expect(result.rows[0]._uuid).toStrictEqual([
				UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"),
				UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11")
			]);
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
