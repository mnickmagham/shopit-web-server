import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const genSaltMock = jest.fn() as unknown as jest.Mock;
const hashMock = jest.fn() as unknown as jest.Mock;

const signSessionTokenMock = jest.fn((payload: { userId: string; email: string }) =>
  `token-for-${payload.userId}`
);
const toPublicUserMock = jest.fn((user: { _id: string; email: string }) => ({
  _id: user._id,
  email: user.email,
}));

jest.mock("bcryptjs", () => ({
  genSalt: genSaltMock,
  hash: hashMock,
}));

jest.mock("../../middleware/auth", () => ({
  signSessionToken: signSessionTokenMock,
}));

jest.mock("../../utils/sanitizeUser", () => ({
  toPublicUser: toPublicUserMock,
}));

jest.mock("../../utils/rateLimit", () => ({
  rateLimit: jest.fn(() => ({ allowed: true, remaining: 4, resetAt: 0 })),
}));

const rateLimitMock = require("../../utils/rateLimit").rateLimit as jest.Mock;

const users: Array<{ _id: string; email: string; password: string }> = [];
const findOneMock = jest.fn(
  async (query: { email: string }): Promise<{ email: string } | null> =>
    users.find((u) => u.email === query.email) ?? null
);
jest.mock("../../models/User", () => ({
  __esModule: true,
  default: class User {
    _id: string;
    email: string;
    password: string;
    constructor(data: { _id?: string; email: string; password: string }) {
      this._id = data._id ?? `user-${users.length + 1}`;
      this.email = data.email;
      this.password = data.password;
    }
    static findOne: (query: { email: string }) => Promise<{ email: string } | null> = findOneMock;
    async save() {
      users.push({ _id: this._id, email: this.email, password: this.password });
      return this;
    }
    toObject() {
      return { _id: this._id, email: this.email, password: this.password };
    }
  },
  __users: users,
}));

import signupController from "../signupController";

function makeRes() {
  const json = jest.fn().mockReturnThis();
  const status = jest.fn().mockReturnValue({ json }) as unknown as {
    status: jest.Mock;
    json: jest.Mock;
  };
  return { status, json };
}

function makeReq(body?: unknown, method = "POST") {
  return { body, method } as unknown as Request;
}

beforeEach(() => {
  users.length = 0;
  jest.clearAllMocks();
  genSaltMock.mockResolvedValue("salt");
  hashMock.mockResolvedValue("hashed");
  signSessionTokenMock.mockReturnValue("fresh-token");
  toPublicUserMock.mockReturnValue({ _id: "u1", email: "a@b.c" });
  rateLimitMock.mockReturnValue({ allowed: true, remaining: 4, resetAt: 0 });
});

describe("signupController", () => {
  it("rejects non-POST with 405", async () => {
    const res = makeRes();
    await signupController(makeReq({}, "GET") as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("rejects missing fields with 400", async () => {
    const res = makeRes();
    await signupController(makeReq({}) as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email and password are required" })
    );
  });

  it("rejects invalid email format with 400", async () => {
    const res = makeRes();
    await signupController(
      makeReq({ email: "not-an-email", password: "pw", name: "Ada" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid email address" })
    );
  });

  it("rejects an existing email with 409", async () => {
    users.push({ _id: "u1", email: "a@b.c", password: "x" });
    const res = makeRes();
    await signupController(
      makeReq({ email: "a@b.c", password: "pw", name: "Ada" }) as Request,
      res as unknown as Response
    );
    expect(findOneMock).toHaveBeenCalledWith({ email: "a@b.c" });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User already exists" })
    );
  });

  it("creates the user, hashes the password, and never exposes the hash", async () => {
    const res = makeRes();
    await signupController(
      makeReq({ email: "a@b.c", password: "pw", name: "Ada" }) as Request,
      res as unknown as Response
    );
    expect(genSaltMock).toHaveBeenCalledWith(10);
    expect(hashMock).toHaveBeenCalledWith("pw", "salt");
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload.token).toBe("fresh-token");
    expect(payload.user).toEqual({ _id: "u1", email: "a@b.c" });
    expect(payload.user.password).toBeUndefined();
    expect(users).toHaveLength(1);
    expect(users[0].password).toBe("hashed");
  });

  it("rate-limits signup attempts with 429 before looking up the user", async () => {
    rateLimitMock.mockReturnValue({ allowed: false, remaining: 0, resetAt: 1 });
    const res = makeRes();
    await signupController(
      makeReq({ email: "a@b.c", password: "pw", name: "Ada" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(429);
    expect(findOneMock).not.toHaveBeenCalled();
  });
});
