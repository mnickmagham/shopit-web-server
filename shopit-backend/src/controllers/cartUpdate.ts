import { Request, Response } from "express";
import Product from "../models/Product";
import User from "../models/User";
import { authUser } from "../middleware/auth";

export async function cartUpdate(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { productId, quantity } = req.body;
  if (!productId || typeof quantity !== "number") {
    return res.status(400).json({ message: "Invalid request" });
  }
  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity must be zero or greater" });
  }
  // userId comes from the verified JWT (requireAuth), never from the body.
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart: { productId: string; quantity: number }[] = user.cart;
  if (quantity === 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else if (quantity > 0) {
    const existingProduct = cart.find((item) => item.productId === productId);
    if (existingProduct) {
      existingProduct.quantity = quantity;
      cart = cart.filter((item) => item.productId !== productId);
      cart.push(existingProduct);
    } else {
      cart.push({ productId, quantity });
    }
  }
  user.cart = cart;
  await user.save();
  return res.status(200).json({ message: "Cart updated", cart: user.cart });
}

// Mounted behind requireAuth. Replaces the user's cart with the client's
// local cart after login (guest -> authenticated merge).
export const newCart = async (req: Request, res: Response) => {
  const { cart } = req.body;
  if (!Array.isArray(cart)) {
    return res.status(400).json({ message: "cart must be an array" });
  }
  for (const item of cart) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.productId !== "string" ||
      !item.productId ||
      typeof item.quantity !== "number" ||
      item.quantity < 0
    ) {
      return res.status(400).json({ message: "Invalid cart item" });
    }
  }
  const auth = authUser(req, res);
  if (!auth) return;
  const userId = auth.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.cart = cart;
  await user.save();
  return res.status(200).json({ cart: user.cart });
};
