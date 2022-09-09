import { randomUUID, RandomUUIDOptions } from "node:crypto";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface UUIDObject {
	UUID: string;
}

interface UUID {
	toString(): string;
	toJSON(): UUIDObject;
	equals(otherUUID: string | UUID | UUIDObject): boolean;

	UUID: string;
}

interface UUIDConstructor {
	from(data: UUID | UUIDObject): UUID;
	from(str: string): UUID;
	/**
	 * Generates a random [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID. The UUID is generated using a
	 * cryptographic pseudorandom number generator.
	 */
	generate(options?: RandomUUIDOptions): UUID;
	/**
	 * Returns `true` if `obj` is a `UUID`, `false` otherwise.
	 */
	isUUID(obj: any): obj is UUID;
}

const UUID: UUIDConstructor = {
	from(arg: string | UUID | UUIDObject): UUID {
		if (typeof arg === "string") {
			if (
				arg.match(
					/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i
				)
			) {
				return new UUIDClass({
					UUID: arg
				});
			}
			throw new Error("Invalid UUID string");
		} else if (UUID.isUUID(arg)) {
			return new UUIDClass(arg.toJSON());
		} else {
			return new UUIDClass(arg);
		}
	},
	generate(options?: RandomUUIDOptions): UUID {
		return new UUIDClass({
			UUID: randomUUID(options)
		});
	},
	isUUID(obj: any): obj is UUID {
		return obj instanceof UUIDClass;
	}
};

class UUIDClass implements UUID {
	private _UUID: string;

	constructor(data: UUIDObject) {
		this._UUID = data.UUID.toLowerCase();
	}

	toString(): string {
		return this._UUID;
	}

	toJSON(): UUIDObject {
		return {
			UUID: this._UUID
		};
	}

	equals(otherUUID: string | UUID | UUIDObject): boolean {
		if (typeof otherUUID === "string") {
			return otherUUID.toLowerCase() === this.toString().toLowerCase();
		} else if (UUID.isUUID(otherUUID)) {
			return (
				otherUUID.toString().toLowerCase() === this.toString().toLowerCase()
			);
		} else {
			return otherUUID.UUID.toLowerCase() === this._UUID.toLowerCase();
		}
	}

	get UUID(): string {
		return this._UUID;
	}

	set UUID(UUID: string) {
		if (
			!UUID.match(
				/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i
			)
		)
			throw new Error("Invalid UUID");
		this._UUID = UUID;
	}
}

types.setTypeParser(DataType.uuid as any, parser(UUID));
types.setTypeParser(DataType._uuid as any, arrayParser(UUID, ","));

export { UUID, UUIDObject };
