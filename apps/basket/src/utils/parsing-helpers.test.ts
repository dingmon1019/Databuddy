import { describe, expect, test } from "bun:test";
import {
	parseEventId,
	parseProperties,
	parseTimestamp,
} from "./parsing-helpers";

describe("parseTimestamp", () => {
	test("returns numeric timestamp as-is", () => {
		expect(parseTimestamp(1_700_000_000_000)).toBe(1_700_000_000_000);
	});

	test("falls back to Date.now() for non-number inputs", () => {
		const before = Date.now();
		const result = parseTimestamp("invalid");
		const after = Date.now();

		expect(result).toBeGreaterThanOrEqual(before);
		expect(result).toBeLessThanOrEqual(after);
	});
});

describe("parseProperties", () => {
	test("serializes provided object", () => {
		expect(parseProperties({ a: 1, b: "two" })).toBe('{"a":1,"b":"two"}');
	});

	test("returns empty object string when input is missing", () => {
		expect(parseProperties(undefined)).toBe("{}");
		expect(parseProperties(null)).toBe("{}");
	});
});

describe("parseEventId", () => {
	test("returns provided event id when valid", () => {
		const fallback = () => "generated-id";
		expect(parseEventId("evt_123", fallback)).toBe("evt_123");
	});

	test("trims long event ids to configured max length", () => {
		const longId = "a".repeat(1000);
		const result = parseEventId(longId, () => "generated-id");
		expect(result.length).toBe(255);
	});

	test("uses generator when event id is empty or invalid", () => {
		const fallback = () => "generated-id";
		expect(parseEventId("", fallback)).toBe("generated-id");
		expect(parseEventId(undefined, fallback)).toBe("generated-id");
		expect(parseEventId(123, fallback)).toBe("generated-id");
	});
});
