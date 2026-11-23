import mongoose from "mongoose";
import connectDB from "../db";

const originalConnect = mongoose.connect;
const originalExit = process.exit;

let connectMock: jest.Mock;

beforeEach(() => {
  connectMock = jest.fn();
  mongoose.connect = connectMock;
  jest.spyOn(process, "exit").mockImplementation((() => {}) as any);
});

afterEach(() => {
  mongoose.connect = originalConnect;
  (process.exit as unknown as jest.Mock).mockRestore();
});

describe("connectDB", () => {
  it("throws an error instead of exiting when mongoose.connect rejects", async () => {
    const error = new Error("connection refused");
    connectMock.mockRejectedValue(error);

    await expect(connectDB()).rejects.toThrow("Database connection failed");
    expect(process.exit).not.toHaveBeenCalled();
  });
});
