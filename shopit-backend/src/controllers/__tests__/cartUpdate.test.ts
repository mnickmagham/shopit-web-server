import { Request, Response } from "express";

const products: Array<{ _id: string }> = [];
const ProductFindById = jest.fn(async (_id: string) =>
  products.find((p) => p._id === _id) ?? null
);
jest.mock("../../models/Product", () => ({
  __esModule: true,
  default: class Product {
    _id: string;
    constructor(data: { _id: string }) {
      this._id = data._id;
    }
    static findById: (_id: string) => Promise<{ _id: string } | null> =
      ProductFindById;
  },
}));

const cartUsers: Array<{
  _id: string;
  cart: { productId: string; quantity: number }[];
  saveCalls: number;
}> = [];
const UserFindById = jest.fn(async (_id: string) => {
  const raw = cartUsers.find((u) => u._id === _id);
  if (!raw) return null;
  const u: {
    _id: string;
    cart: { productId: string; quantity: number }[];
    saveCalls: number;
    save: () => Promise<unknown>;
  } = {
    _id: raw._id,
    cart: [...raw.cart],
    saveCalls: raw.saveCalls,
    save: async () => {
      const found = cartUsers.find((x) => x._id === u._id);
      if (found) {
        found.cart = u.cart;
        found.saveCalls++;
      } else {
        cartUsers.push({ _id: u._id, cart: u.cart, saveCalls: u.saveCalls + 1 });
      }
      return u;
    },
  };
  return u as unknown as {
    _id: string;
    cart: { productId: string; quantity: number }[];
  } | null;
});
jest.mock("../../models/User", () => ({
  __esModule: true,
  default: class User {
    _id: string;
    cart: { productId: string; quantity: number }[];
    saveCalls = 0;
    constructor(data: {
      _id: string;
      cart?: { productId: string; quantity: number }[];
    }) {
      this._id = data._id;
      this.cart = data.cart ?? [];
    }
    static findById: (
      _id: string
    ) => Promise<{ _id: string; cart: { productId: string; quantity: number }[] } | null> = UserFindById;
    async save() {
      const found = cartUsers.find((x) => x._id === this._id);
      if (found) {
        found.cart = this.cart;
        found.saveCalls++;
      } else {
        cartUsers.push({ _id: this._id, cart: this.cart, saveCalls: 1 });
      }
      return this;
    }
  },
}));

type CartReq = {
  auth: { userId: string; email: string } | null;
  body: unknown;
  method?: string;
};
const authUserMock = jest.fn((req: CartReq, res: any) => {
  if (!req.auth) {
    res.status(401).json({ message: "Authentication required" });
    return null;
  }
  return req.auth;
});
jest.mock("../../middleware/auth", () => ({
  authUser: authUserMock,
}));

import { cartUpdate } from "../cartUpdate";

function makeRes() {
  const json = jest.fn().mockReturnThis();
  const status = jest.fn().mockReturnValue({ json }) as unknown as {
    status: jest.Mock;
    json: jest.Mock;
  };
  return { status, json };
}

function makeReq(
  auth: { userId: string; email: string } | null,
  body: unknown,
  method = "POST"
) {
  return { auth, body, method } as unknown as Request;
}

const authPayload: { userId: string; email: string } = {
  userId: "u1",
  email: "a@b.c",
};

beforeEach(() => {
  products.length = 0;
  cartUsers.length = 0;
  jest.clearAllMocks();
  products.push({ _id: "p1" });
  cartUsers.push({
    _id: "u1",
    cart: [],
    saveCalls: 0,
  });
});

describe("cartUpdate", () => {
  it("adds a product to an empty cart", async () => {
    const res = makeRes();
    await cartUpdate(
      makeReq(authPayload, { productId: "p1", quantity: 2 }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Cart updated",
        cart: expect.arrayContaining([{ productId: "p1", quantity: 2 }]),
      })
    );
  });

  it("returns 404 for an unknown product", async () => {
    const res = makeRes();
    await cartUpdate(
      makeReq(authPayload, { productId: "nope", quantity: 1 }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 401 when auth is missing", async () => {
    const res = makeRes();
    await cartUpdate(
      makeReq(null, { productId: "p1", quantity: 1 }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
