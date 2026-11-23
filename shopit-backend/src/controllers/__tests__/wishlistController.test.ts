import { Request, Response } from "express";

const products: Array<{ _id: string }> = [];
const ProductFind = jest.fn(async (query: { _id: { $in: string[] } }) =>
  products.filter((p) => query._id.$in.includes(p._id))
);
jest.mock("../../models/Product", () => ({
  __esModule: true,
  default: class Product {
    _id: string;
    constructor(data: { _id: string }) {
      this._id = data._id;
    }
    static find = ProductFind;
  },
}));

type WishlistDoc = {
  userId: string;
  products: { productId: string }[];
  saveCalls: number;
  save: () => Promise<WishlistDoc>;
  toObject: () => { userId: string; products: { productId: string }[] };
};

const wishlists: WishlistDoc[] = [];

function makeWishlist(
  userId: string,
  products: { productId: string }[]
): WishlistDoc {
  const obj: WishlistDoc = {
    userId,
    products: [...products],
    saveCalls: 0,
    save: async function () {
      this.saveCalls++;
      const existing = wishlists.find((w) => w.userId === this.userId);
      if (existing) {
        existing.products = this.products;
        existing.saveCalls = this.saveCalls;
      } else {
        wishlists.push({ ...this, saveCalls: this.saveCalls } as WishlistDoc);
      }
      return this;
    },
    toObject: function () {
      return { userId: this.userId, products: [...this.products] };
    },
  };
  return obj;
}

const WishlistFindOne = jest.fn(async (query: { userId: string }) =>
  wishlists.find((w) => w.userId === query.userId) ?? null
);
const WishlistCreate = jest.fn(
  async (data: { userId: string; products: { productId: string }[] }) => {
    const obj = makeWishlist(data.userId, data.products);
    wishlists.push(obj);
    return obj;
  }
);
jest.mock("../../models/Wishlist", () => ({
  __esModule: true,
  default: class Wishlist {
    userId: string;
    products: { productId: string }[] = [];
    saveCalls = 0;
    constructor(data: {
      userId: string;
      products: { productId: string }[];
    }) {
      this.userId = data.userId;
      this.products = data.products;
    }
    static findOne = WishlistFindOne;
    static create = WishlistCreate;
    async save() {
      this.saveCalls += 1;
      const existing = wishlists.find((w) => w.userId === this.userId);
      if (existing) existing.products = this.products;
      else wishlists.push({ ...this, saveCalls: this.saveCalls } as WishlistDoc);
      return this;
    }
    toObject() {
      return { userId: this.userId, products: this.products };
    }
  },
}));

const userObjs: Array<{ _id: string; email: string }> = [];
const UserFindById = jest.fn(async (_id: string) =>
  userObjs.find((u) => u._id === _id) ?? null
);
jest.mock("../../models/User", () => ({
  __esModule: true,
  default: class User {
    _id: string;
    email: string;
    constructor(data: { _id: string; email: string }) {
      this._id = data._id;
      this.email = data.email;
    }
    static findById: (_id: string) => Promise<{ _id: string } | null> =
      UserFindById;
  },
}));

type WishReq = {
  auth: { userId: string; email: string } | null;
  body: unknown;
  method?: string;
};
const authUserMock = jest.fn((req: WishReq, res: any) => {
  if (!req.auth) {
    res.status(401).json({ message: "Authentication required" });
    return null;
  }
  return req.auth;
});
jest.mock("../../middleware/auth", () => ({
  authUser: authUserMock,
}));

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} from "../wishlistController";

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
  wishlists.length = 0;
  userObjs.length = 0;
  jest.clearAllMocks();
  products.push({ _id: "p1" }, { _id: "p2" });
  userObjs.push({ _id: "u1", email: "a@b.c" });
});

describe("wishlistController", () => {
  it("adds a product to the wishlist", async () => {
    const res = makeRes();
    await addToWishlist(
      makeReq(authPayload, { productId: "p1" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        wishlist: expect.objectContaining({
          products: expect.arrayContaining([{ productId: "p1" }]),
        }),
      })
    );
  });

  it("adds any productId (source does not validate product existence)", async () => {
    const res = makeRes();
    await addToWishlist(
      makeReq(authPayload, { productId: "nope" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        wishlist: expect.objectContaining({
          products: expect.arrayContaining([{ productId: "nope" }]),
        }),
      })
    );
  });

  it("returns 401 when auth is missing", async () => {
    const res = makeRes();
    await addToWishlist(
      makeReq(null, { productId: "p1" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("gets the wishlist products array", async () => {
    wishlists.push(makeWishlist("u1", [{ productId: "p1" }]));
    const res = makeRes();
    await getWishlist(
      makeReq(authPayload, {}) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ _id: "p1" }]);
  });

  it("removes a product from the wishlist", async () => {
    wishlists.push(makeWishlist("u1", [{ productId: "p1" }, { productId: "p2" }]));
    const res = makeRes();
    await removeFromWishlist(
      makeReq(authPayload, { productId: "p1" }) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload.wishlist.products).toEqual([{ productId: "p2" }]);
  });

  it("clears the wishlist", async () => {
    wishlists.push(makeWishlist("u1", [{ productId: "p1" }]));
    const res = makeRes();
    await clearWishlist(
      makeReq(authPayload, {}) as Request,
      res as unknown as Response
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ wishlist: expect.objectContaining({ products: [] }) })
    );
  });
});
