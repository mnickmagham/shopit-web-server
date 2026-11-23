import { Request, Response } from "express";
import User from "../models/User";
import Wishlist, { IWishlist } from "../models/Wishlist";
import Product from "../models/Product";
import { authUser } from "../middleware/auth";

// All handlers here are mounted behind requireAuth in server.ts, so
// req.auth is guaranteed to be set. authUser is used to fail closed
// (401) if a handler is ever mounted without requireAuth.

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId: productId } = req.body;
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let wishlist: IWishlist | null = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [{ productId }] });
  } else if (!wishlist.products.some((p) => p.productId === productId)) {
    wishlist.products.push({ productId });
    await wishlist.save();
  }
  return res
    .status(200)
    .json({ message: "Product added to wishlist", wishlist });
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  const wishlist: IWishlist | null = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }
  wishlist.products = wishlist.products.filter(
    (item) => item.productId !== productId
  );
  await wishlist.save();
  return res
    .status(200)
    .json({ message: "Product removed from wishlist", wishlist });
};

export const getWishlist = async (req: Request, res: Response) => {
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  const wishlist: IWishlist | null = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }
  const productIds = wishlist.products.map((item) => item.productId);
  try {
    const products = await Product.find({ _id: { $in: productIds } });
    return res.status(200).json(products);
  } catch (error) {
    console.error("getWishlist error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearWishlist = async (req: Request, res: Response) => {
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  const wishlist: IWishlist | null = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }
  wishlist.products = [];
  await wishlist.save();
  return res.status(200).json({ message: "Wishlist cleared", wishlist });
};

export const UpdateWishlistAfterLogin = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }
  let wishlist: IWishlist | null = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [{ productId }] });
  } else if (!wishlist.products.some((p) => p.productId === productId)) {
    wishlist.products.push({ productId });
    await wishlist.save();
  }
  return res
    .status(200)
    .json({ message: "Product added to wishlist", wishlist });
};
