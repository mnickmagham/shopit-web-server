import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import signinController from "./controllers/signinController";
import signupController from "./controllers/signupController";
import getProducts, {
  getProductById,
  getProductsByIds,
} from "./controllers/productsController";
import { cartUpdate, newCart } from "./controllers/cartUpdate";
import {
  addToWishlist,
  clearWishlist,
  removeFromWishlist,
  getWishlist,
  UpdateWishlistAfterLogin,
} from "./controllers/wishlistController";
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();

// Enable CORS for your frontend (Vercel URL) and localhost
app.use(
  cors({
    origin: ["http://localhost:3000", "https://shopit-tau.vercel.app"], // Your frontend URL
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Define API routes
app.get("/api/test", (req, res) => {
  res.send("API is running...");
});
app.post("/api/signin", signinController);
app.post("/api/signup", signupController);
app.post("/api/products", getProducts);
app.post("/api/product", getProductById);
// Authenticated routes: requireAuth verifies req.body.jwt and sets req.auth
app.post("/api/cart", requireAuth, cartUpdate);
app.post("/api/products/ids", getProductsByIds);
app.post("/api/wishlist/add", requireAuth, addToWishlist);
app.post("/api/wishlist/remove", requireAuth, removeFromWishlist);
app.post("/api/wishlist/get", requireAuth, getWishlist);
app.post("/api/wishlist/clear", requireAuth, clearWishlist);
app.post("/api/cart/new", requireAuth, newCart);
app.post("/api/wishlist/update", requireAuth, UpdateWishlistAfterLogin);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
// Export the app to be handled by Vercel
export default app;
