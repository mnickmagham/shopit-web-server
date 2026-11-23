import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const verifyMock = jest.fn() as unknown as jest.Mock;
const compareMock = jest.fn() as unknown as jest.Mock;

jest.mock("bcryptjs", () => ({
  compare: compareMock,
}));

jest.mock("jsonwebtoken", () => ({
  verify: verifyMock,
}));

const signSessionTokenMock = jest.fn((payload: { userId: string; email: string }) =>
  `token-for-${payload.userId}`
);
const toPublicUserMock = jest.fn((user: { _id: string; email: string }) => ({
  _id: user._id,
  email: user.email,
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
    static findById: (_id: string) => Promise<{ _id: string } | null> = jest.fn(
      async (_id) => users.find((u) => u._id === _id) ?? null
    );
    static findOne: (query: { email: string }) => Promise<{ email: string } | null> = jest.fn(
      async (query) => users.find((u) => u.email === query.email) ?? null
    );
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

import signinController from "../signinController";

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
  rateLimitMock.mockReturnValue({ allowed: true, remaining: 4, resetAt: 0 });
});

describe("signinController", () => {
  it("rejects non-POST with 405", async () => {
    const res = makeRes();
    await signinController(
      makeReq({}, "GET") as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("rejects missing email or password with 400", async () => {
    const res = makeRes();
    await signinController(makeReq({}) as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email and password are required" })
    );
    expect(compareMock).not.toHaveBeenCalled();
  });

  it("rejects invalid email format with 400", async () => {
    const res = makeRes();
    await signinController(
      makeReq({ email: "not-an-email", password: "pw" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid email address" })
    );
  });

  it("rejects unknown user with 400 and does not compare passwords", async () => {
    const res = makeRes();
    await signinController(
      makeReq({ email: "nope@x.com", password: "pw" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid email or password" })
    );
    expect(compareMock).not.toHaveBeenCalled();
  });

  it("rejects wrong password with 400 using bcrypt.compare only", async () => {
    users.push({ _id: "u1", email: "a@b.c", password: "$2a$10$hash" });
    compareMock.mockResolvedValue(false);
    const res = makeRes();
    await signinController(
      makeReq({ email: "a@b.c", password: "wrong" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(compareMock).toHaveBeenCalledWith("wrong", "$2a$10$hash");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid email or password" })
    );
  });

  it("returns public user and token on correct password, never the hash", async () => {
    users.push({ _id: "u1", email: "a@b.c", password: "$2a$10$hash" });
    compareMock.mockResolvedValue(true);
    signSessionTokenMock.mockReturnValue("fresh-token");
    toPublicUserMock.mockReturnValue({ _id: "u1", email: "a@b.c" });

    const res = makeRes();
    await signinController(
      makeReq({ email: "a@b.c", password: "right" }) as Request,
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload.token).toBe("fresh-token");
    expect(payload.user).toEqual({ _id: "u1", email: "a@b.c" });
    expect(payload.user.password).toBeUndefined();
    expect(compareMock).toHaveBeenCalledWith("right", "$2a$10$hash");
  });

  it("restores session from a valid token without a password", async () => {
    users.push({ _id: "u1", email: "a@b.c", password: "$2a$10$hash" });
    verifyMock.mockReturnValue({ userId: "u1" });
    signSessionTokenMock.mockReturnValue("fresh-token");
    toPublicUserMock.mockReturnValue({ _id: "u1", email: "a@b.c" });

    const res = makeRes();
    await signinController(
      makeReq({ token: "some-token" }) as Request,
      res as unknown as Response
    );

    expect(verifyMock).toHaveBeenCalledWith("some-token", process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload.token).toBe("fresh-token");
    expect(compareMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid restore token with 401", async () => {
    verifyMock.mockImplementation(() => {
      throw new Error("bad token");
    });
    const res = makeRes();
    await signinController(
      makeReq({ token: "bad" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid or expired token" })
    );
  });

  it("rate-limits password attempts with 429", async () => {
    rateLimitMock.mockReturnValue({ allowed: false, remaining: 0, resetAt: 1 });
    const res = makeRes();
    await signinController(
      makeReq({ email: "a@b.c", password: "pw" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(429);
    expect(compareMock).not.toHaveBeenCalled();
  });
});
