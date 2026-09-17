import { describe, expect, test } from "@jest/globals";
import { shiftsOverlap } from "./shift.rules.js";

describe("shiftsOverlap", () => {
  test("returns true when two shifts overlap", () => {
    // Arrange
    const existingStart = new Date("2026-09-10T09:00:00");
    const existingEnd = new Date("2026-09-10T14:00:00");

    const newStart = new Date("2026-09-10T12:00:00");
    const newEnd = new Date("2026-09-10T16:00:00");

    // Act
    const result = shiftsOverlap(existingStart, existingEnd, newStart, newEnd);

    // Assert
    expect(result).toBe(true);
  });

  test("returns false when two shifts do not overlap", () => {
    // Arrange
    const existingStart = new Date("2026-09-10T09:00:00");
    const existingEnd = new Date("2026-09-10T14:00:00");

    const newStart = new Date("2026-09-10T14:00:00");
    const newEnd = new Date("2026-09-10T18:00:00");
    // Act
    const result = shiftsOverlap(existingStart, existingEnd, newStart, newEnd);
    // Assert
    expect(result).toBe(false);
  });

  test("returns true when the new shift is inside the first", () => {
    // Arrange
    const existingStart = new Date("2026-09-10T09:00:00");
    const existingEnd = new Date("2026-09-10T18:00:00");

    const newStart = new Date("2026-09-10T12:00:00");
    const newEnd = new Date("2026-09-10T14:00:00");
    // Act
    const result = shiftsOverlap(existingStart, existingEnd, newStart, newEnd);
    // Assert
    expect(result).toBe(true);
  });
});
