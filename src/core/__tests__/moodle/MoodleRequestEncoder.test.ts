import { describe, expect, it } from "vitest";
import {
  encodeMoodleParams,
  MoodleRequestEncoder,
} from "@/core/moodle/MoodleRequestEncoder";

describe("MoodleRequestEncoder", () => {
  describe("Scalar Encoding", () => {
    it("should correctly encode scalar string parameters", () => {
      const params = {
        password: "abc",
        keyword: "biology",
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("password")).toBe("abc");
      expect(encoded.get("keyword")).toBe("biology");
    });

    it("should correctly encode scalar integer parameters", () => {
      const params = {
        quizid: 10,
        page: 2,
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("quizid")).toBe("10");
      expect(encoded.get("page")).toBe("2");
    });

    it("should preserve zero (0) and not treat it as missing", () => {
      const params = {
        quizid: 0,
        offset: 0,
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("quizid")).toBe("0");
      expect(encoded.get("offset")).toBe("0");
    });

    it("should correctly encode scalar boolean parameters (true -> 1, false -> 0)", () => {
      const params = {
        finishattempt: true,
        preview: false,
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("finishattempt")).toBe("1");
      expect(encoded.get("preview")).toBe("0");
    });

    it("should preserve false appropriately and not omit it", () => {
      const params = {
        active: false,
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.has("active")).toBe(true);
      expect(encoded.get("active")).toBe("0");
    });

    it("should preserve empty string and not omit it", () => {
      const params = {
        filter: "",
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.has("filter")).toBe(true);
      expect(encoded.get("filter")).toBe("");
    });

    it("should omit undefined values", () => {
      const params = {
        definedKey: "hello",
        missingKey: undefined,
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.has("definedKey")).toBe(true);
      expect(encoded.has("missingKey")).toBe(false);
      expect(encoded.get("missingKey")).toBeNull();
    });

    it("should omit null values unless explicit semantics are defined", () => {
      const params = {
        definedKey: "hello",
        nullKey: null,
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.has("definedKey")).toBe(true);
      expect(encoded.has("nullKey")).toBe(false);
      expect(encoded.get("nullKey")).toBeNull();
    });
  });

  describe("Array Encoding", () => {
    it("should correctly encode numeric arrays using PHP bracket indices", () => {
      const params = {
        courseids: [10, 20, 30],
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("courseids[0]")).toBe("10");
      expect(encoded.get("courseids[1]")).toBe("20");
      expect(encoded.get("courseids[2]")).toBe("30");
      // Must not encode as comma-separated string
      expect(encoded.has("courseids")).toBe(false);
    });

    it("should correctly encode string arrays", () => {
      const params = {
        tags: ["math", "science"],
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("tags[0]")).toBe("math");
      expect(encoded.get("tags[1]")).toBe("science");
    });

    it("should handle empty arrays by omitting them", () => {
      const params = {
        emptyList: [],
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.toString()).toBe("");
    });
  });

  describe("Nested Object & Array of Objects Encoding", () => {
    it("should correctly encode nested objects", () => {
      const params = {
        criteria: {
          category: "science",
          visible: true,
        },
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("criteria[category]")).toBe("science");
      expect(encoded.get("criteria[visible]")).toBe("1");
    });

    it("should correctly encode array of objects", () => {
      const params = {
        users: [
          { id: 10, role: "student" },
          { id: 20, role: "teacher" },
        ],
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("users[0][id]")).toBe("10");
      expect(encoded.get("users[0][role]")).toBe("student");
      expect(encoded.get("users[1][id]")).toBe("20");
      expect(encoded.get("users[1][role]")).toBe("teacher");
    });

    it("should correctly encode deeply nested structures", () => {
      const params = {
        filters: {
          groups: [
            {
              id: 1,
              rules: {
                operator: "AND",
                value: 42,
              },
            },
          ],
        },
      };
      const encoded = MoodleRequestEncoder.encode(params);
      expect(encoded.get("filters[groups][0][id]")).toBe("1");
      expect(encoded.get("filters[groups][0][rules][operator]")).toBe("AND");
      expect(encoded.get("filters[groups][0][rules][value]")).toBe("42");
    });
  });

  describe("Backward compatibility helper", () => {
    it("encodeMoodleParams helper behaves identically to MoodleRequestEncoder.encode", () => {
      const params = {
        userid: 42,
        courses: [1, 2],
      };
      const encoded = encodeMoodleParams(params);
      expect(encoded.get("userid")).toBe("42");
      expect(encoded.get("courses[0]")).toBe("1");
      expect(encoded.get("courses[1]")).toBe("2");
    });

    it("should handle empty or undefined input safely", () => {
      const encodedEmpty = MoodleRequestEncoder.encode({});
      expect(encodedEmpty.toString()).toBe("");

      const encodedUndefined = MoodleRequestEncoder.encode(undefined);
      expect(encodedUndefined.toString()).toBe("");
    });
  });
});
