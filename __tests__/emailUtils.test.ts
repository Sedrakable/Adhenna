import { escapeHtml, safeText } from "@/app/api/emailUtils";

describe("emailUtils", () => {
  describe("escapeHtml", () => {
    test("escapes dangerous HTML characters", () => {
      const input = `<script>alert("x")</script>`;
      const result = escapeHtml(input);

      expect(result).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    });

    test("escapes ampersands and quotes", () => {
      const input = `Tom & "Jerry"`;
      const result = escapeHtml(input);

      expect(result).toBe("Tom &amp; &quot;Jerry&quot;");
    });
  });

  describe("safeText", () => {
    test("returns escaped string input", () => {
      expect(safeText(`<b>Hello</b>`)).toBe("&lt;b&gt;Hello&lt;/b&gt;");
    });

    test("returns empty string for undefined", () => {
      expect(safeText(undefined)).toBe("");
    });

    test("returns empty string for null", () => {
      expect(safeText(null)).toBe("");
    });

    test("returns empty string for non-string values", () => {
      expect(safeText(123)).toBe("");
      expect(safeText({ hello: "world" })).toBe("");
    });
  });
});
