import { signSessionToken, requireAuth, authUser } from "../auth";
import { Request, Response } from "express";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// jest.mock intercepts the module, so require returns the mock object — no
// real ESM jsonwebtoken is loaded (which would crash under CJS jest).
const { sign: signMock, verify: verifyMock } = require("jsonwebtoken") as {
  sign: jest.Mock;
  verify: jest.Mock;
};

type MockRes = {
  status: jest.Mock;
  json: jest.Mock;
};

function makeRes(): MockRes {
  const json = jest.fn().mockReturnThis();
  const status = jest.fn().mockReturnValue({ json }) as unknown as MockRes["status"];
  return { status, json };
}

type AuthReq = {
  body?: unknown;
  auth?: { userId: string; email: string };
};

type AuthPayload = { userId: string; email: string };

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

beforeEach(() => {
  jest.clearAllMocks();
  signMock.mockReturnValue("mock-token");
  verifyMock.mockReturnValue({ userId: "u1", email: "a@b.c" });
});

describe("signSessionToken", () => {
  it("issues a token via jwt.sign with payload and secret", () => {
    const token = signSessionToken({ userId: "abc", email: "a@b.c" });
    expect(token).toBe("mock-token");
    expect(signMock).toHaveBeenCalledWith(
      { userId: "abc", email: "a@b.c" },
      "test-secret",
      expect.objectContaining({ expiresIn: "1h" })
    );
  });

  it("throws when JWT_SECRET is missing", () => {
    const prev = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    expect(() =>
      signSessionToken({ userId: "x", email: "x@y.z" })
    ).toThrow(/JWT_SECRET/);
    process.env.JWT_SECRET = prev;
  });
});

describe("requireAuth", () => {
  it("calls next and attaches req.auth for a valid token", () => {
    const req: AuthReq = { body: { jwt: "some-token" } };
    const res: MockRes = makeRes();
    const next = jest.fn();

    requireAuth(req as Request, res as unknown as Response, next);

    expect(verifyMock).toHaveBeenCalledWith("some-token", "test-secret");
    expect(next).toHaveBeenCalled();
    expect((req as { auth?: AuthPayload }).auth).toEqual({
      userId: "u1",
      email: "a@b.c",
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("responds 401 when no token is provided", () => {
    const req: AuthReq = { body: {} };
    const res: MockRes = makeRes();
    const next = jest.fn();

    requireAuth(req as Request, res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Authentication required" })
    );
  });

  it("responds 401 for an invalid token", () => {
    verifyMock.mockImplementation(() => {
      throw new Error("bad token");
    });
    const req: AuthReq = { body: { jwt: "garbage" } };
    const res: MockRes = makeRes();
    const next = jest.fn();

    requireAuth(req as Request, res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("authUser", () => {
  it("returns the payload when req.auth is set", () => {
    const req: AuthReq = {
      auth: { userId: "u1", email: "a@b.c" },
    };
    const res: MockRes = makeRes();

    const out = authUser(req as Request, res as unknown as Response);

    expect(out).toEqual({ userId: "u1", email: "a@b.c" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("responds 401 and returns null when req.auth is missing", () => {
    const req: AuthReq = {};
    const res: MockRes = makeRes();

    const out = authUser(req as Request, res as unknown as Response);

    expect(out).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Authentication required" })
    );
  });
});
