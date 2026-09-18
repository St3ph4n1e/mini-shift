import { describe, expect, jest, test } from "@jest/globals";

type EmployeeWithPositions = {
  id: number;
  name: string;
  positions: {
    id: number;
    name: string;
  }[];
};

const findUniqueMock =
  jest.fn<(args: unknown) => Promise<EmployeeWithPositions | null>>();

jest.unstable_mockModule("../lib/prisma.js", () => ({
  prisma: {
    employee: {
      findUnique: findUniqueMock,
    },
  },
}));

const { getEmployeeById } = await import("./employee.service.js");

describe("getEmployeeById", () => {
  test("returns the employee found by Prisma", async () => {
    // Arrange
    const bob = {
      id: 3,
      name: "Bob",
      positions: [
        {
          id: 4,
          name: "Cashier",
        },
      ],
    };

    findUniqueMock.mockResolvedValue(bob);

    // Act
    const result = await getEmployeeById(3);

    // Assert
    expect(result).toEqual(bob);
  });

  test("returns employee null", async () => {
    // Arrange
    const bob = {
      id: 3,
      name: "Bob",
      positions: [
        {
          id: 4,
          name: "Cashier",
        },
      ],
    };

    findUniqueMock.mockResolvedValue(null);

    // Act
    const result = await getEmployeeById(999);

    // Assert
    expect(result).toBeNull();
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 999 },
      include: {
        positions: true,
      },
    });
  });
});
