import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional class names", () => {
    expect(cn("bg-red-500", false && "text-white", "p-4")).toBe("bg-red-500 p-4");
    expect(cn("bg-red-500", true && "text-white", "p-4")).toBe("bg-red-500 text-white p-4");
  });

  it("should merge tailwind classes correctly resolving conflicts", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("p-4", "p-8")).toBe("p-8");
  });
});
