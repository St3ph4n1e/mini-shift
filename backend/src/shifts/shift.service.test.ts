import { beforeEach, describe, expect, jest, test } from "@jest/globals";

type EmployeeWithPositions = {
  id: number;
  name: string;
  positions: {
    id: number;
    name: string;
  }[];
};

const findUniqueMock = jest.fn(
  async (_args: unknown): Promise<EmployeeWithPositions | null> => null,
);
const findFirstMock = jest.fn(
  async (_args: unknown): Promise<unknown | null> => null,
);

const createMock = jest.fn(async (_args: unknown): Promise<unknown> => ({}));

jest.unstable_mockModule("../lib/prisma.js", () => ({
  prisma: {
    employee: {
      findUnique: findUniqueMock,
    },
    shift: {
      findFirst: findFirstMock,
      create: createMock,
    },
  },
}));

const { createShift } = await import("./shift.service.js");

beforeEach(() => {
  findUniqueMock.mockReset();
  findFirstMock.mockReset();
  createMock.mockReset();
});

describe("createShift", () => {
  test("rejects when employee does not have the required position", async () => {
    // Arrange
    findUniqueMock.mockResolvedValue({
      id: 4,
      name: "Stephanie",
      positions: [
        {
          id: 3,
          name: "Cook",
        },
      ],
    });

    const data = {
      startAt: new Date("2026-09-20T09:00:00"),
      endAt: new Date("2026-09-20T14:00:00"),
      positionId: 4, // Cashier
      employeeId: 4,
    };

    // Act + Assert
    await expect(createShift(data)).rejects.toMatchObject({
      statusCode: 409,
      message: "Employee does not have the required position",
    });

    expect(createMock).not.toHaveBeenCalled();
  });
});
