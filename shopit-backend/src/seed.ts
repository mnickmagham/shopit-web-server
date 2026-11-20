import mongoose from "mongoose";
import Product from "./models/Product";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shopit";

// 120 initial products across multiple categories. Picture URLs use picsum.photos
// (real placeholder images) so the frontend can render something immediately. Each product
// now has multiple fallback picture URLs, a price field, and sample comments so the
// product detail page renders completely.
const seedProducts = [    {
      id: "prod-001",
      title: "Wireless Headphones",
      available: 24,
      price: 435,
      description: "Noise-cancelling over-ear headphones with 30h battery life.",
      pictureUrls: ["https://picsum.photos/seed/prod-001/400/400", "https://picsum.photos/seed/prod-001-alt1/400/400", "https://picsum.photos/seed/prod-001-alt2/400/400"],
      categories: ["electronics", "audio"],
      tags: ["wireless", "noise-cancelling", "headphones"],
      info: [
        { infoTitle: "Battery life", info: "30 hours" },
        { infoTitle: "Connectivity", info: "Bluetooth 5.2" },
        { infoTitle: "Weight", info: "255 g" }
      ],
      options: ["Black", "White", "Silver"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-5", date: "2026-11-03" },
        { comment: "Good quality for the price.", commentedBy: "user-8", date: "2026-11-18" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-002",
      title: "Smart Watch",
      available: 12,
      price: 150,
      description: "Fitness tracker with heart rate, GPS and always-on display.",
      pictureUrls: ["https://picsum.photos/seed/prod-002/400/400", "https://picsum.photos/seed/prod-002-alt1/400/400", "https://picsum.photos/seed/prod-002-alt2/400/400"],
      categories: ["electronics", "wearables"],
      tags: ["fitness", "gps", "smart-watch"],
      info: [
        { infoTitle: "Battery life", info: "7 days" },
        { infoTitle: "Water resistance", info: "5 ATM" },
        { infoTitle: "Display", info: "AMOLED 1.4\"" }
      ],
      options: ["Black", "Rose Gold", "Blue"],
      comments: [
        { comment: "Great battery life!", commentedBy: "user-1", date: "2026-11-01" }
      ],
      scores: [4, 5],
    },
    {
      id: "prod-003",
      title: "Smartphone",
      available: 18,
      price: 740,
      description: "6.5\" OLED display phone with triple camera and 128 GB storage.",
      pictureUrls: ["https://picsum.photos/seed/prod-003/400/400", "https://picsum.photos/seed/prod-003-alt1/400/400", "https://picsum.photos/seed/prod-003-alt2/400/400"],
      categories: ["electronics", "phones"],
      tags: ["smartphone", "oled", "camera"],
      info: [
        { infoTitle: "Storage", info: "128 GB" },
        { infoTitle: "Screen", info: "6.5\" OLED" },
        { infoTitle: "Camera", info: "48 MP + 12 MP + 5 MP" }
      ],
      options: ["Midnight Black", "Starlight", "Pacific Blue"],
      comments: [
        { comment: "Camera is amazing.", commentedBy: "user-3", date: "2026-10-15" }
      ],
      scores: [5, 5, 4, 5],
    },
    {
      id: "prod-004",
      title: "Laptop",
      available: 8,
      price: 830,
      description: "14\" ultrabook with 16 GB RAM, 512 GB SSD and long battery life.",
      pictureUrls: ["https://picsum.photos/seed/prod-004/400/400", "https://picsum.photos/seed/prod-004-alt1/400/400", "https://picsum.photos/seed/prod-004-alt2/400/400"],
      categories: ["electronics", "computers"],
      tags: ["laptop", "ultrabook", "work"],
      info: [
        { infoTitle: "RAM", info: "16 GB" },
        { infoTitle: "Storage", info: "512 GB SSD" },
        { infoTitle: "Screen", info: "14\"" }
      ],
      options: ["Space Gray", "Silver"],
      comments: [
        { comment: "Works as described.", commentedBy: "user-5", date: "2026-10-14" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-005",
      title: "Bluetooth Speaker",
      available: 30,
      price: 725,
      description: "Portable waterproof speaker with deep bass and 20h playtime.",
      pictureUrls: ["https://picsum.photos/seed/prod-005/400/400", "https://picsum.photos/seed/prod-005-alt1/400/400", "https://picsum.photos/seed/prod-005-alt2/400/400"],
      categories: ["electronics", "audio"],
      tags: ["bluetooth", "waterproof", "speaker"],
      info: [
        { infoTitle: "Battery life", info: "20 hours" },
        { infoTitle: "Water resistance", info: "IPX7" },
        { infoTitle: "Weight", info: "420 g" }
      ],
      options: ["Black", "Blue", "Red"],
      comments: [
        { comment: "Loud and clear sound.", commentedBy: "user-4", date: "2026-09-20" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-006",
      title: "Tablet",
      available: 15,
      price: 1070,
      description: "10.9\" tablet with stylus support, ideal for notes and drawing.",
      pictureUrls: ["https://picsum.photos/seed/prod-006/400/400", "https://picsum.photos/seed/prod-006-alt1/400/400", "https://picsum.photos/seed/prod-006-alt2/400/400"],
      categories: ["electronics", "tablets"],
      tags: ["tablet", "stylus", "media"],
      info: [
        { infoTitle: "Screen", info: "10.9\"" },
        { infoTitle: "Storage", info: "64 GB" },
        { infoTitle: "Connectivity", info: "Wi-Fi" }
      ],
      options: ["Silver", "Space Gray", "Gold"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-8", date: "2026-10-10" }
      ],
      scores: [4, 3, 4],
    },
    {
      id: "prod-007",
      title: "Gaming Mouse",
      available: 40,
      price: 925,
      description: "Ergonomic RGB gaming mouse with 16,000 DPI sensor.",
      pictureUrls: ["https://picsum.photos/seed/prod-007/400/400", "https://picsum.photos/seed/prod-007-alt1/400/400", "https://picsum.photos/seed/prod-007-alt2/400/400"],
      categories: ["electronics", "gaming"],
      tags: ["mouse", "gaming", "rgb"],
      info: [
        { infoTitle: "Sensor", info: "16,000 DPI" },
        { infoTitle: "Buttons", info: "8 programmable" },
        { infoTitle: "Connection", info: "Wired USB" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Very precise clicks.", commentedBy: "user-5", date: "2026-11-05" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-008",
      title: "Mechanical Keyboard",
      available: 22,
      price: 140,
      description: "Compact mechanical keyboard with blue switches and RGB backlight.",
      pictureUrls: ["https://picsum.photos/seed/prod-008/400/400", "https://picsum.photos/seed/prod-008-alt1/400/400", "https://picsum.photos/seed/prod-008-alt2/400/400"],
      categories: ["electronics", "computers"],
      tags: ["keyboard", "mechanical", "typing"],
      info: [
        { infoTitle: "Switches", info: "Blue tactile" },
        { infoTitle: "Layout", info: "60%" },
        { infoTitle: "Backlight", info: "RGB" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-3", date: "2026-11-08" },
        { comment: "Exceeded my expectations.", commentedBy: "user-6", date: "2026-10-27" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-009",
      title: "Webcam",
      available: 16,
      price: 765,
      description: "1080p webcam with autofocus and built-in privacy shutter.",
      pictureUrls: ["https://picsum.photos/seed/prod-009/400/400", "https://picsum.photos/seed/prod-009-alt1/400/400", "https://picsum.photos/seed/prod-009-alt2/400/400"],
      categories: ["electronics", "computers"],
      tags: ["webcam", "1080p", "video"],
      info: [
        { infoTitle: "Resolution", info: "1080p" },
        { infoTitle: "Focus", info: "Autofocus" },
        { infoTitle: "Connection", info: "USB-A" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Good for meetings.", commentedBy: "user-6", date: "2026-08-12" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-010",
      title: "Power Bank",
      available: 50,
      price: 880,
      description: "20,000 mAh power bank with fast-charging USB-C ports.",
      pictureUrls: ["https://picsum.photos/seed/prod-010/400/400", "https://picsum.photos/seed/prod-010-alt1/400/400", "https://picsum.photos/seed/prod-010-alt2/400/400"],
      categories: ["electronics", "accessories"],
      tags: ["power-bank", "charging", "portable"],
      info: [
        { infoTitle: "Capacity", info: "20,000 mAh" },
        { infoTitle: "Ports", info: "2x USB-C, 1x USB-A" },
        { infoTitle: "Weight", info: "350 g" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Would buy again.", commentedBy: "user-6", date: "2026-11-08" },
        { comment: "Nice design and works well.", commentedBy: "user-7", date: "2026-11-15" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-011",
      title: "Running Shoes",
      available: 50,
      price: 70,
      description: "Lightweight cushioned running shoes for daily training.",
      pictureUrls: ["https://picsum.photos/seed/prod-011/400/400", "https://picsum.photos/seed/prod-011-alt1/400/400", "https://picsum.photos/seed/prod-011-alt2/400/400"],
      categories: ["fashion", "footwear"],
      tags: ["running", "cushioned", "shoes"],
      info: [
        { infoTitle: "Size range", info: "38–47 EU" },
        { infoTitle: "Weight", info: "280 g" },
        { infoTitle: "Drop", info: "8 mm" }
      ],
      options: ["Black/White", "All Black", "White/Blue"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-6", date: "2026-10-12" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-012",
      title: "Leather Jacket",
      available: 9,
      price: 95,
      description: "Classic genuine leather jacket with quilted lining.",
      pictureUrls: ["https://picsum.photos/seed/prod-012/400/400", "https://picsum.photos/seed/prod-012-alt1/400/400", "https://picsum.photos/seed/prod-012-alt2/400/400"],
      categories: ["fashion", "outerwear"],
      tags: ["leather", "jacket", "winter"],
      info: [
        { infoTitle: "Material", info: "Genuine leather" },
        { infoTitle: "Lining", info: "Quilted polyester" },
        { infoTitle: "Fit", info: "Slim" }
      ],
      options: ["Black", "Brown"],
      comments: [
        { comment: "Looks great, fits well.", commentedBy: "user-7", date: "2026-10-01" }
      ],
      scores: [5, 5],
    },
    {
      id: "prod-013",
      title: "Denim Jeans",
      available: 35,
      price: 135,
      description: "Slim-fit stretch denim jeans in classic blue wash.",
      pictureUrls: ["https://picsum.photos/seed/prod-013/400/400", "https://picsum.photos/seed/prod-013-alt1/400/400", "https://picsum.photos/seed/prod-013-alt2/400/400"],
      categories: ["fashion", "bottoms"],
      tags: ["jeans", "denim", "slim-fit"],
      info: [
        { infoTitle: "Fit", info: "Slim" },
        { infoTitle: "Material", info: "Stretch denim" },
        { infoTitle: "Wash", info: "Classic blue" }
      ],
      options: ["30", "32", "34", "36", "38"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-8", date: "2026-11-11" }
      ],
      scores: [4, 4, 3, 4],
    },
    {
      id: "prod-014",
      title: "Cotton T-Shirt",
      available: 60,
      price: 170,
      description: "Soft organic cotton crew-neck t-shirt.",
      pictureUrls: ["https://picsum.photos/seed/prod-014/400/400", "https://picsum.photos/seed/prod-014-alt1/400/400", "https://picsum.photos/seed/prod-014-alt2/400/400"],
      categories: ["fashion", "tops"],
      tags: ["t-shirt", "cotton", "casual"],
      info: [
        { infoTitle: "Material", info: "100% organic cotton" },
        { infoTitle: "Neckline", info: "Crew neck" },
        { infoTitle: "Fit", info: "Regular" }
      ],
      options: ["White", "Black", "Navy", "Grey"],
      comments: [
        { comment: "Very comfortable.", commentedBy: "user-8", date: "2026-09-05" }
      ],
      scores: [5, 4, 5, 4],
    },
    {
      id: "prod-015",
      title: "Backpack",
      available: 30,
      price: 85,
      description: "Water-resistant 25 L backpack with laptop compartment.",
      pictureUrls: ["https://picsum.photos/seed/prod-015/400/400", "https://picsum.photos/seed/prod-015-alt1/400/400", "https://picsum.photos/seed/prod-015-alt2/400/400"],
      categories: ["fashion", "bags"],
      tags: ["laptop", "water-resistant", "backpack"],
      info: [
        { infoTitle: "Capacity", info: "25 L" },
        { infoTitle: "Laptop fit", info: "up to 15\"" },
        { infoTitle: "Weight", info: "900 g" }
      ],
      options: ["Black", "Navy", "Olive"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-3", date: "2026-10-16" },
        { comment: "Would buy again.", commentedBy: "user-7", date: "2026-10-06" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-016",
      title: "Dress Shirt",
      available: 28,
      price: 150,
      description: "Wrinkle-resistant formal dress shirt with cufflinks.",
      pictureUrls: ["https://picsum.photos/seed/prod-016/400/400", "https://picsum.photos/seed/prod-016-alt1/400/400", "https://picsum.photos/seed/prod-016-alt2/400/400"],
      categories: ["fashion", "tops"],
      tags: ["shirt", "formal", "workwear"],
      info: [
        { infoTitle: "Material", info: "Cotton blend" },
        { infoTitle: "Collar", info: "Cutaway" },
        { infoTitle: "Fit", info: "Slim" }
      ],
      options: ["White", "Light Blue", "Pink"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-5", date: "2026-10-21" },
        { comment: "Impressed with the quality.", commentedBy: "user-8", date: "2026-10-09" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-017",
      title: "Hoodie",
      available: 45,
      price: 195,
      description: "Heavyweight pullover hoodie with kangaroo pocket.",
      pictureUrls: ["https://picsum.photos/seed/prod-017/400/400", "https://picsum.photos/seed/prod-017-alt1/400/400", "https://picsum.photos/seed/prod-017-alt2/400/400"],
      categories: ["fashion", "tops"],
      tags: ["hoodie", "casual", "warm"],
      info: [
        { infoTitle: "Material", info: "Cotton-polyester blend" },
        { infoTitle: "Pocket", info: "Kangaroo" },
        { infoTitle: "Weight", info: "400 g/m²" }
      ],
      options: ["Black", "Grey", "Navy", "Burgundy"],
      comments: [
        { comment: "Soft and warm.", commentedBy: "user-9", date: "2026-10-22" }
      ],
      scores: [5, 5],
    },
    {
      id: "prod-018",
      title: "Sneakers",
      available: 42,
      price: 65,
      description: "Retro-style canvas sneakers with rubber sole.",
      pictureUrls: ["https://picsum.photos/seed/prod-018/400/400", "https://picsum.photos/seed/prod-018-alt1/400/400", "https://picsum.photos/seed/prod-018-alt2/400/400"],
      categories: ["fashion", "footwear"],
      tags: ["sneakers", "canvas", "casual"],
      info: [
        { infoTitle: "Material", info: "Canvas" },
        { infoTitle: "Sole", info: "Rubber" },
        { infoTitle: "Closure", info: "Lace-up" }
      ],
      options: ["White", "Black", "Red"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-8", date: "2026-11-26" },
        { comment: "Nice design and works well.", commentedBy: "user-6", date: "2026-10-25" }
      ],
      scores: [4, 3, 4, 4],
    },
    {
      id: "prod-019",
      title: "Wool Scarf",
      available: 25,
      price: 75,
      description: "Soft merino wool scarf for cold weather.",
      pictureUrls: ["https://picsum.photos/seed/prod-019/400/400", "https://picsum.photos/seed/prod-019-alt1/400/400", "https://picsum.photos/seed/prod-019-alt2/400/400"],
      categories: ["fashion", "accessories"],
      tags: ["scarf", "wool", "winter"],
      info: [
        { infoTitle: "Material", info: "Merino wool" },
        { infoTitle: "Length", info: "180 cm" },
        { infoTitle: "Width", info: "30 cm" }
      ],
      options: ["Charcoal", "Camel", "Navy"],
      comments: [
        { comment: "Very soft, not itchy.", commentedBy: "user-10", date: "2026-11-08" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-020",
      title: "Sunglasses",
      available: 55,
      price: 60,
      description: "Polarized UV400 sunglasses with lightweight frame.",
      pictureUrls: ["https://picsum.photos/seed/prod-020/400/400", "https://picsum.photos/seed/prod-020-alt1/400/400", "https://picsum.photos/seed/prod-020-alt2/400/400"],
      categories: ["fashion", "accessories"],
      tags: ["sunglasses", "polarized", "uv-protection"],
      info: [
        { infoTitle: "Lenses", info: "Polarized UV400" },
        { infoTitle: "Frame", info: "Lightweight acetate" },
        { infoTitle: "Shape", info: "Wayfarer" }
      ],
      options: ["Black", "Tortoise", "Gold"],
      comments: [
        { comment: "Solid value, fast delivery.", commentedBy: "user-5", date: "2026-11-04" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-021",
      title: "Coffee Maker",
      available: 8,
      price: 375,
      description: "Programmable drip coffee maker with thermal carafe.",
      pictureUrls: ["https://picsum.photos/seed/prod-021/400/400", "https://picsum.photos/seed/prod-021-alt1/400/400", "https://picsum.photos/seed/prod-021-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["coffee", "programmable", "kitchen"],
      info: [
        { infoTitle: "Capacity", info: "1.25 L" },
        { infoTitle: "Power", info: "900 W" },
        { infoTitle: "Timer", info: "24h programmable" }
      ],
      options: ["Stainless Steel", "Black"],
      comments: [
        { comment: "Makes excellent coffee.", commentedBy: "user-2", date: "2026-10-20" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-022",
      title: "Blender",
      available: 14,
      price: 80,
      description: "High-speed blender for smoothies, soups and sauces.",
      pictureUrls: ["https://picsum.photos/seed/prod-022/400/400", "https://picsum.photos/seed/prod-022-alt1/400/400", "https://picsum.photos/seed/prod-022-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["blender", "kitchen", "appliance"],
      info: [
        { infoTitle: "Power", info: "1000 W" },
        { infoTitle: "Jar", info: "1.5 L glass" },
        { infoTitle: "Speeds", info: "3 + pulse" }
      ],
      options: ["Black", "Red"],
      comments: [
        { comment: "Good quality for the price.", commentedBy: "user-10", date: "2026-10-20" },
        { comment: "Would buy again.", commentedBy: "user-4", date: "2026-10-01" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-023",
      title: "Table Lamp",
      available: 26,
      price: 130,
      description: "Modern LED table lamp with touch dimmer and warm light.",
      pictureUrls: ["https://picsum.photos/seed/prod-023/400/400", "https://picsum.photos/seed/prod-023-alt1/400/400", "https://picsum.photos/seed/prod-023-alt2/400/400"],
      categories: ["home", "lighting"],
      tags: ["lamp", "led", "desk"],
      info: [
        { infoTitle: "Bulb", info: "Integrated LED" },
        { infoTitle: "Dimmer", info: "Touch control" },
        { infoTitle: "Color temp", info: "Warm white" }
      ],
      options: ["Matte Black", "Brushed Brass", "White"],
      comments: [
        { comment: "Great for reading.", commentedBy: "user-11", date: "2026-09-30" }
      ],
      scores: [5, 4, 4],
    },
    {
      id: "prod-024",
      title: "Throw Pillow",
      available: 70,
      price: 445,
      description: "Plush decorative throw pillow with removable cover.",
      pictureUrls: ["https://picsum.photos/seed/prod-024/400/400", "https://picsum.photos/seed/prod-024-alt1/400/400", "https://picsum.photos/seed/prod-024-alt2/400/400"],
      categories: ["home", "decor"],
      tags: ["pillow", "cushion", "decor"],
      info: [
        { infoTitle: "Size", info: "45 x 45 cm" },
        { infoTitle: "Fill", info: "Polyester fiber" },
        { infoTitle: "Cover", info: "Removable" }
      ],
      options: ["Beige", "Grey", "Teal", "Mustard"],
      comments: [
        { comment: "Good product overall.", commentedBy: "user-10", date: "2026-10-23" }
      ],
      scores: [4, 4, 5, 4],
    },
    {
      id: "prod-025",
      title: "Air Fryer",
      available: 11,
      price: 185,
      description: "5.5 L air fryer with digital touch controls and preset programs.",
      pictureUrls: ["https://picsum.photos/seed/prod-025/400/400", "https://picsum.photos/seed/prod-025-alt1/400/400", "https://picsum.photos/seed/prod-025-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["air-fryer", "kitchen", "appliance"],
      info: [
        { infoTitle: "Capacity", info: "5.5 L" },
        { infoTitle: "Control", info: "Digital touch" },
        { infoTitle: "Presets", info: "8 cooking programs" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Crispy fries every time.", commentedBy: "user-12", date: "2026-10-10" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-026",
      title: "Duvet Cover Set",
      available: 18,
      price: 350,
      description: "100% cotton duvet cover set with two pillowcases.",
      pictureUrls: ["https://picsum.photos/seed/prod-026/400/400", "https://picsum.photos/seed/prod-026-alt1/400/400", "https://picsum.photos/seed/prod-026-alt2/400/400"],
      categories: ["home", "bedding"],
      tags: ["duvet", "bedding", "cotton"],
      info: [
        { infoTitle: "Material", info: "100% cotton" },
        { infoTitle: "Size", info: "Queen" },
        { infoTitle: "Pieces", info: "1 duvet cover + 2 pillowcases" }
      ],
      options: ["White", "Grey", "Navy", "Blush"],
      comments: [
        { comment: "Soft and breathable.", commentedBy: "user-13", date: "2026-08-25" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-027",
      title: "Cookware Set",
      available: 7,
      price: 365,
      description: "5-piece non-stick cookware set with stay-cool handles.",
      pictureUrls: ["https://picsum.photos/seed/prod-027/400/400", "https://picsum.photos/seed/prod-027-alt1/400/400", "https://picsum.photos/seed/prod-027-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["cookware", "pots", "pans"],
      info: [
        { infoTitle: "Pieces", info: "5" },
        { infoTitle: "Coating", info: "Non-stick" },
        { infoTitle: "Handles", info: "Stay-cool" }
      ],
      options: ["Black", "Grey"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-10", date: "2026-11-06" }
      ],
      scores: [4, 3, 4, 4],
    },
    {
      id: "prod-028",
      title: "Wall Clock",
      available: 22,
      price: 165,
      description: "Minimalist silent wall clock with wooden frame.",
      pictureUrls: ["https://picsum.photos/seed/prod-028/400/400", "https://picsum.photos/seed/prod-028-alt1/400/400", "https://picsum.photos/seed/prod-028-alt2/400/400"],
      categories: ["home", "decor"],
      tags: ["clock", "wall", "decor"],
      info: [
        { infoTitle: "Diameter", info: "30 cm" },
        { infoTitle: "Movement", info: "Silent quartz" },
        { infoTitle: "Frame", info: "Wood" }
      ],
      options: ["Light Wood", "Dark Wood", "White"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-4", date: "2026-10-09" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-029",
      title: "Electric Kettle",
      available: 33,
      price: 235,
      description: "1.7 L electric kettle with auto shut-off and boil-dry protection.",
      pictureUrls: ["https://picsum.photos/seed/prod-029/400/400", "https://picsum.photos/seed/prod-029-alt1/400/400", "https://picsum.photos/seed/prod-029-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["kettle", "electric", "kitchen"],
      info: [
        { infoTitle: "Capacity", info: "1.7 L" },
        { infoTitle: "Power", info: "1500 W" },
        { infoTitle: "Safety", info: "Auto shut-off" }
      ],
      options: ["Stainless Steel", "Black", "White"],
      comments: [
        { comment: "Boils water quickly.", commentedBy: "user-14", date: "2026-10-05" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-030",
      title: "Bath Towel Set",
      available: 40,
      price: 25,
      description: "6-piece plush cotton bath towel set.",
      pictureUrls: ["https://picsum.photos/seed/prod-030/400/400", "https://picsum.photos/seed/prod-030-alt1/400/400", "https://picsum.photos/seed/prod-030-alt2/400/400"],
      categories: ["home", "bath"],
      tags: ["towels", "cotton", "bath"],
      info: [
        { infoTitle: "Pieces", info: "6" },
        { infoTitle: "Material", info: "100% cotton" },
        { infoTitle: "GSM", info: "600" }
      ],
      options: ["White", "Grey", "Blue", "Pink"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-1", date: "2026-11-13" }
      ],
      scores: [4, 5, 4, 4],
    },
    {
      id: "prod-031",
      title: "Yoga Mat",
      available: 48,
      price: 55,
      description: "Non-slip 6 mm TPE yoga mat with carrying strap.",
      pictureUrls: ["https://picsum.photos/seed/prod-031/400/400", "https://picsum.photos/seed/prod-031-alt1/400/400", "https://picsum.photos/seed/prod-031-alt2/400/400"],
      categories: ["sport", "fitness"],
      tags: ["yoga", "mat", "exercise"],
      info: [
        { infoTitle: "Thickness", info: "6 mm" },
        { infoTitle: "Material", info: "TPE" },
        { infoTitle: "Size", info: "183 x 61 cm" }
      ],
      options: ["Purple", "Blue", "Black", "Pink"],
      comments: [
        { comment: "Great grip, doesn't slide.", commentedBy: "user-15", date: "2026-09-18" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-032",
      title: "Dumbbell Set",
      available: 12,
      price: 100,
      description: "Adjustable dumbbell set, 2.5–24 kg per hand.",
      pictureUrls: ["https://picsum.photos/seed/prod-032/400/400", "https://picsum.photos/seed/prod-032-alt1/400/400", "https://picsum.photos/seed/prod-032-alt2/400/400"],
      categories: ["sport", "fitness"],
      tags: ["dumbbells", "weights", "strength"],
      info: [
        { infoTitle: "Range", info: "2.5–24 kg" },
        { infoTitle: "Type", info: "Adjustable" },
        { infoTitle: "Pieces", info: "Pair" }
      ],
      options: ["Black/Red"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-8", date: "2026-10-10" }
      ],
      scores: [4, 5],
    },
    {
      id: "prod-033",
      title: "Basketball",
      available: 20,
      price: 150,
      description: "Official size 7 indoor/outdoor basketball with deep channels.",
      pictureUrls: ["https://picsum.photos/seed/prod-033/400/400", "https://picsum.photos/seed/prod-033-alt1/400/400", "https://picsum.photos/seed/prod-033-alt2/400/400"],
      categories: ["sport", "balls"],
      tags: ["basketball", "sports", "outdoor"],
      info: [
        { infoTitle: "Size", info: "7 (official)" },
        { infoTitle: "Material", info: "Composite leather" },
        { infoTitle: "Use", info: "Indoor/outdoor" }
      ],
      options: ["Orange"],
      comments: [
        { comment: "Good grip outdoors.", commentedBy: "user-16", date: "2026-10-12" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-034",
      title: "Resistance Bands",
      available: 55,
      price: 85,
      description: "Set of 5 latex resistance bands with door anchor and carry bag.",
      pictureUrls: ["https://picsum.photos/seed/prod-034/400/400", "https://picsum.photos/seed/prod-034-alt1/400/400", "https://picsum.photos/seed/prod-034-alt2/400/400"],
      categories: ["sport", "fitness"],
      tags: ["resistance-bands", "exercise", "portable"],
      info: [
        { infoTitle: "Pieces", info: "5 bands + accessories" },
        { infoTitle: "Material", info: "Latex" },
        { infoTitle: "Levels", info: "Light to extra heavy" }
      ],
      options: ["Assorted"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-6", date: "2026-11-15" },
        { comment: "Works as described.", commentedBy: "user-7", date: "2026-11-14" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-035",
      title: "Jump Rope",
      available: 60,
      price: 60,
      description: "Adjustable speed jump rope with ergonomic handles.",
      pictureUrls: ["https://picsum.photos/seed/prod-035/400/400", "https://picsum.photos/seed/prod-035-alt1/400/400", "https://picsum.photos/seed/prod-035-alt2/400/400"],
      categories: ["sport", "fitness"],
      tags: ["jump-rope", "cardio", "exercise"],
      info: [
        { infoTitle: "Length", info: "Adjustable up to 3 m" },
        { infoTitle: "Bearing", info: "Ball bearing" },
        { infoTitle: "Handles", info: "Ergonomic foam" }
      ],
      options: ["Black", "Blue", "Red"],
      comments: [
        { comment: "Good quality for the price.", commentedBy: "user-1", date: "2026-11-01" },
        { comment: "Impressed with the quality.", commentedBy: "user-6", date: "2026-10-14" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-036",
      title: "Tennis Racket",
      available: 9,
      price: 190,
      description: "Lightweight graphite tennis racket, pre-strung.",
      pictureUrls: ["https://picsum.photos/seed/prod-036/400/400", "https://picsum.photos/seed/prod-036-alt1/400/400", "https://picsum.photos/seed/prod-036-alt2/400/400"],
      categories: ["sport", "racket-sports"],
      tags: ["tennis", "racket", "sports"],
      info: [
        { infoTitle: "Head size", info: "100 in²" },
        { infoTitle: "Weight", info: "285 g unstrung" },
        { infoTitle: "Material", info: "Graphite" }
      ],
      options: ["White/Black", "Blue/Black"],
      comments: [
        { comment: "Great for beginners.", commentedBy: "user-17", date: "2026-08-10" }
      ],
      scores: [4, 4, 3],
    },
    {
      id: "prod-037",
      title: "Foam Roller",
      available: 36,
      price: 185,
      description: "High-density EVA foam roller for muscle recovery.",
      pictureUrls: ["https://picsum.photos/seed/prod-037/400/400", "https://picsum.photos/seed/prod-037-alt1/400/400", "https://picsum.photos/seed/prod-037-alt2/400/400"],
      categories: ["sport", "recovery"],
      tags: ["foam-roller", "recovery", "massage"],
      info: [
        { infoTitle: "Material", info: "High-density EVA" },
        { infoTitle: "Size", info: "33 x 14 cm" },
        { infoTitle: "Surface", info: "Grid texture" }
      ],
      options: ["Black", "Blue"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-10", date: "2026-11-02" },
        { comment: "Happy with this purchase.", commentedBy: "user-9", date: "2026-11-16" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-038",
      title: "Soccer Ball",
      available: 28,
      price: 135,
      description: "Size 5 soccer ball with butyl bladder for better air retention.",
      pictureUrls: ["https://picsum.photos/seed/prod-038/400/400", "https://picsum.photos/seed/prod-038-alt1/400/400", "https://picsum.photos/seed/prod-038-alt2/400/400"],
      categories: ["sport", "balls"],
      tags: ["soccer", "football", "sports"],
      info: [
        { infoTitle: "Size", info: "5" },
        { infoTitle: "Bladder", info: "Butyl" },
        { infoTitle: "Panels", info: "32" }
      ],
      options: ["White/Black"],
      comments: [
        { comment: "Holds air well.", commentedBy: "user-18", date: "2026-11-02" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-039",
      title: "Exercise Bike",
      available: 4,
      price: 25,
      description: "Magnetic exercise bike with LCD display and adjustable resistance.",
      pictureUrls: ["https://picsum.photos/seed/prod-039/400/400", "https://picsum.photos/seed/prod-039-alt1/400/400", "https://picsum.photos/seed/prod-039-alt2/400/400"],
      categories: ["sport", "equipment"],
      tags: ["exercise-bike", "cardio", "home-gym"],
      info: [
        { infoTitle: "Resistance", info: "Magnetic, 8 levels" },
        { infoTitle: "Display", info: "LCD" },
        { infoTitle: "Max user weight", info: "120 kg" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-2", date: "2026-10-03" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-040",
      title: "Skipping Rope Mat",
      available: 24,
      price: 60,
      description: "Protective floor mat for jump rope and cardio workouts.",
      pictureUrls: ["https://picsum.photos/seed/prod-040/400/400", "https://picsum.photos/seed/prod-040-alt1/400/400", "https://picsum.photos/seed/prod-040-alt2/400/400"],
      categories: ["sport", "accessories"],
      tags: ["mat", "floor-protection", "cardio"],
      info: [
        { infoTitle: "Size", info: "200 x 100 cm" },
        { infoTitle: "Thickness", info: "6 mm" },
        { infoTitle: "Material", info: "NBR foam" }
      ],
      options: ["Black", "Purple"],
      comments: [
        { comment: "Good quality for the price.", commentedBy: "user-6", date: "2026-11-04" },
        { comment: "Good quality for the price.", commentedBy: "user-8", date: "2026-10-08" }
      ],
      scores: [4, 3, 4],
    },
    {
      id: "prod-041",
      title: "Face Moisturizer",
      available: 44,
      price: 35,
      description: "Hydrating face moisturizer with hyaluronic acid, 50 ml.",
      pictureUrls: ["https://picsum.photos/seed/prod-041/400/400", "https://picsum.photos/seed/prod-041-alt1/400/400", "https://picsum.photos/seed/prod-041-alt2/400/400"],
      categories: ["beauty", "skincare"],
      tags: ["moisturizer", "hydration", "skincare"],
      info: [
        { infoTitle: "Volume", info: "50 ml" },
        { infoTitle: "Key ingredient", info: "Hyaluronic acid" },
        { infoTitle: "Skin type", info: "All" }
      ],
      options: ["Light", "Rich"],
      comments: [
        { comment: "Absorbs quickly.", commentedBy: "user-19", date: "2026-10-14" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-042",
      title: "Eau de Parfum",
      available: 16,
      price: 50,
      description: "Floral-woody eau de parfum, 100 ml spray bottle.",
      pictureUrls: ["https://picsum.photos/seed/prod-042/400/400", "https://picsum.photos/seed/prod-042-alt1/400/400", "https://picsum.photos/seed/prod-042-alt2/400/400"],
      categories: ["beauty", "fragrance"],
      tags: ["perfume", "fragrance", "eau-de-parfum"],
      info: [
        { infoTitle: "Volume", info: "100 ml" },
        { infoTitle: "Family", info: "Floral woody" },
        { infoTitle: "Concentration", info: "Eau de parfum" }
      ],
      options: ["100 ml"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-10", date: "2026-11-22" }
      ],
      scores: [4, 5, 4, 5],
    },
    {
      id: "prod-043",
      title: "Lipstick Set",
      available: 32,
      price: 85,
      description: "Matte lipstick set of 6 neutral and bold shades.",
      pictureUrls: ["https://picsum.photos/seed/prod-043/400/400", "https://picsum.photos/seed/prod-043-alt1/400/400", "https://picsum.photos/seed/prod-043-alt2/400/400"],
      categories: ["beauty", "makeup"],
      tags: ["lipstick", "makeup", "matte"],
      info: [
        { infoTitle: "Pieces", info: "6" },
        { infoTitle: "Finish", info: "Matte" },
        { infoTitle: "Shades", info: "Neutral + bold" }
      ],
      options: ["Set of 6"],
      comments: [
        { comment: "Long-lasting color.", commentedBy: "user-20", date: "2026-09-11" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-044",
      title: "Hair Dryer",
      available: 14,
      price: 25,
      description: "2200 W ionic hair dryer with diffuser and concentrator nozzles.",
      pictureUrls: ["https://picsum.photos/seed/prod-044/400/400", "https://picsum.photos/seed/prod-044-alt1/400/400", "https://picsum.photos/seed/prod-044-alt2/400/400"],
      categories: ["beauty", "hair"],
      tags: ["hair-dryer", "styling", "appliance"],
      info: [
        { infoTitle: "Power", info: "2200 W" },
        { infoTitle: "Technology", info: "Ionic" },
        { infoTitle: "Nozzles", info: "Diffuser + concentrator" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-10", date: "2026-11-07" },
        { comment: "Impressed with the quality.", commentedBy: "user-9", date: "2026-11-16" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-045",
      title: "Eye Shadow Palette",
      available: 38,
      price: 25,
      description: "12-shade eye shadow palette with matte and shimmer finishes.",
      pictureUrls: ["https://picsum.photos/seed/prod-045/400/400", "https://picsum.photos/seed/prod-045-alt1/400/400", "https://picsum.photos/seed/prod-045-alt2/400/400"],
      categories: ["beauty", "makeup"],
      tags: ["eye-shadow", "makeup", "palette"],
      info: [
        { infoTitle: "Shades", info: "12" },
        { infoTitle: "Finishes", info: "Matte and shimmer" },
        { infoTitle: "Case", info: "Compact mirror" }
      ],
      options: ["Neutral", "Warm", "Cool"],
      comments: [
        { comment: "Pigmented and blendable.", commentedBy: "user-21", date: "2026-10-28" }
      ],
      scores: [5, 4, 4],
    },
    {
      id: "prod-046",
      title: "Body Lotion",
      available: 50,
      price: 55,
      description: "Shea butter body lotion, 400 ml pump bottle.",
      pictureUrls: ["https://picsum.photos/seed/prod-046/400/400", "https://picsum.photos/seed/prod-046-alt1/400/400", "https://picsum.photos/seed/prod-046-alt2/400/400"],
      categories: ["beauty", "skincare"],
      tags: ["lotion", "body", "moisturizer"],
      info: [
        { infoTitle: "Volume", info: "400 ml" },
        { infoTitle: "Key ingredient", info: "Shea butter" },
        { infoTitle: "Packaging", info: "Pump bottle" }
      ],
      options: ["Unscented", "Vanilla", "Almond"],
      comments: [
        { comment: "Solid value, fast delivery.", commentedBy: "user-7", date: "2026-11-24" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-047",
      title: "Makeup Brush Set",
      available: 26,
      price: 45,
      description: "10-piece synthetic makeup brush set with case.",
      pictureUrls: ["https://picsum.photos/seed/prod-047/400/400", "https://picsum.photos/seed/prod-047-alt1/400/400", "https://picsum.photos/seed/prod-047-alt2/400/400"],
      categories: ["beauty", "tools"],
      tags: ["brushes", "makeup", "set"],
      info: [
        { infoTitle: "Pieces", info: "10" },
        { infoTitle: "Bristles", info: "Synthetic" },
        { infoTitle: "Case", info: "Zippered pouch" }
      ],
      options: ["Rose Gold", "Black"],
      comments: [
        { comment: "Soft bristles, good value.", commentedBy: "user-22", date: "2026-08-19" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-048",
      title: "Nail Polish Set",
      available: 41,
      price: 25,
      description: "Gel-effect nail polish set of 10 seasonal colors.",
      pictureUrls: ["https://picsum.photos/seed/prod-048/400/400", "https://picsum.photos/seed/prod-048-alt1/400/400", "https://picsum.photos/seed/prod-048-alt2/400/400"],
      categories: ["beauty", "nails"],
      tags: ["nail-polish", "manicure", "set"],
      info: [
        { infoTitle: "Pieces", info: "10" },
        { infoTitle: "Finish", info: "Gel effect" },
        { infoTitle: "Colors", info: "Seasonal" }
      ],
      options: ["Set of 10"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-7", date: "2026-10-19" },
        { comment: "Would buy again.", commentedBy: "user-10", date: "2026-11-07" }
      ],
      scores: [5, 4, 4, 5],
    },
    {
      id: "prod-049",
      title: "Face Serum",
      available: 29,
      price: 90,
      description: "Vitamin C brightening face serum, 30 ml dropper bottle.",
      pictureUrls: ["https://picsum.photos/seed/prod-049/400/400", "https://picsum.photos/seed/prod-049-alt1/400/400", "https://picsum.photos/seed/prod-049-alt2/400/400"],
      categories: ["beauty", "skincare"],
      tags: ["serum", "vitamin-c", "skincare"],
      info: [
        { infoTitle: "Volume", info: "30 ml" },
        { infoTitle: "Key ingredient", info: "Vitamin C" },
        { infoTitle: "Packaging", info: "Dropper bottle" }
      ],
      options: ["30 ml"],
      comments: [
        { comment: "Skin looks brighter.", commentedBy: "user-23", date: "2026-11-06" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-050",
      title: "Sunscreen SPF 50",
      available: 46,
      price: 95,
      description: "Broad-spectrum sunscreen SPF 50, water-resistant, 100 ml.",
      pictureUrls: ["https://picsum.photos/seed/prod-050/400/400", "https://picsum.photos/seed/prod-050-alt1/400/400", "https://picsum.photos/seed/prod-050-alt2/400/400"],
      categories: ["beauty", "skincare"],
      tags: ["sunscreen", "spf", "sun-protection"],
      info: [
        { infoTitle: "SPF", info: "50" },
        { infoTitle: "Volume", info: "100 ml" },
        { infoTitle: "Water resistant", info: "Yes" }
      ],
      options: ["100 ml"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-3", date: "2026-10-23" },
        { comment: "Great product, highly recommend!", commentedBy: "user-5", date: "2026-10-16" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-051",
      title: "Science Fiction Novel",
      available: 33,
      price: 15,
      description: "Bestselling sci-fi novel, paperback, 420 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-051/400/400", "https://picsum.photos/seed/prod-051-alt1/400/400", "https://picsum.photos/seed/prod-051-alt2/400/400"],
      categories: ["books", "fiction"],
      tags: ["science-fiction", "novel", "paperback"],
      info: [
        { infoTitle: "Pages", info: "420" },
        { infoTitle: "Format", info: "Paperback" },
        { infoTitle: "Genre", info: "Science fiction" }
      ],
      options: ["English"],
      comments: [
        { comment: "Couldn't put it down.", commentedBy: "user-24", date: "2026-09-22" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-052",
      title: "Cookbook",
      available: 21,
      price: 35,
      description: "Modern vegetarian cookbook with 150 recipes, hardcover.",
      pictureUrls: ["https://picsum.photos/seed/prod-052/400/400", "https://picsum.photos/seed/prod-052-alt1/400/400", "https://picsum.photos/seed/prod-052-alt2/400/400"],
      categories: ["books", "cooking"],
      tags: ["cookbook", "vegetarian", "recipes"],
      info: [
        { infoTitle: "Recipes", info: "150" },
        { infoTitle: "Format", info: "Hardcover" },
        { infoTitle: "Diet", info: "Vegetarian" }
      ],
      options: ["English"],
      comments: [
        { comment: "Good product overall.", commentedBy: "user-9", date: "2026-10-03" },
        { comment: "Good quality for the price.", commentedBy: "user-7", date: "2026-11-23" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-053",
      title: "Self-Help Book",
      available: 27,
      price: 10,
      description: "Guide to building better habits, paperback, 310 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-053/400/400", "https://picsum.photos/seed/prod-053-alt1/400/400", "https://picsum.photos/seed/prod-053-alt2/400/400"],
      categories: ["books", "self-help"],
      tags: ["self-help", "habits", "productivity"],
      info: [
        { infoTitle: "Pages", info: "310" },
        { infoTitle: "Format", info: "Paperback" },
        { infoTitle: "Topic", info: "Habits" }
      ],
      options: ["English"],
      comments: [
        { comment: "Life-changing read.", commentedBy: "user-25", date: "2026-10-03" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-054",
      title: "Mystery Thriller",
      available: 19,
      price: 15,
      description: "Gripping mystery thriller, paperback, 380 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-054/400/400", "https://picsum.photos/seed/prod-054-alt1/400/400", "https://picsum.photos/seed/prod-054-alt2/400/400"],
      categories: ["books", "fiction"],
      tags: ["mystery", "thriller", "paperback"],
      info: [
        { infoTitle: "Pages", info: "380" },
        { infoTitle: "Format", info: "Paperback" },
        { infoTitle: "Genre", info: "Mystery thriller" }
      ],
      options: ["English"],
      comments: [
        { comment: "Works as described.", commentedBy: "user-5", date: "2026-11-04" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-055",
      title: "Children's Picture Book",
      available: 42,
      price: 30,
      description: "Illustrated children's picture book, hardcover, 40 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-055/400/400", "https://picsum.photos/seed/prod-055-alt1/400/400", "https://picsum.photos/seed/prod-055-alt2/400/400"],
      categories: ["books", "children"],
      tags: ["children", "picture-book", "illustrated"],
      info: [
        { infoTitle: "Pages", info: "40" },
        { infoTitle: "Format", info: "Hardcover" },
        { infoTitle: "Age", info: "3–7 years" }
      ],
      options: ["English"],
      comments: [
        { comment: "My kid loves it.", commentedBy: "user-26", date: "2026-08-30" }
      ],
      scores: [5, 5, 5],
    },
    {
      id: "prod-056",
      title: "History Non-Fiction",
      available: 15,
      price: 25,
      description: "Deep-dive history non-fiction, hardcover, 520 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-056/400/400", "https://picsum.photos/seed/prod-056-alt1/400/400", "https://picsum.photos/seed/prod-056-alt2/400/400"],
      categories: ["books", "non-fiction"],
      tags: ["history", "non-fiction", "hardcover"],
      info: [
        { infoTitle: "Pages", info: "520" },
        { infoTitle: "Format", info: "Hardcover" },
        { infoTitle: "Topic", info: "History" }
      ],
      options: ["English"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-8", date: "2026-11-17" },
        { comment: "Nice design and works well.", commentedBy: "user-9", date: "2026-11-28" }
      ],
      scores: [4, 5],
    },
    {
      id: "prod-057",
      title: "Poetry Collection",
      available: 18,
      price: 15,
      description: "Contemporary poetry collection, paperback, 160 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-057/400/400", "https://picsum.photos/seed/prod-057-alt1/400/400", "https://picsum.photos/seed/prod-057-alt2/400/400"],
      categories: ["books", "poetry"],
      tags: ["poetry", "literature", "paperback"],
      info: [
        { infoTitle: "Pages", info: "160" },
        { infoTitle: "Format", info: "Paperback" },
        { infoTitle: "Genre", info: "Poetry" }
      ],
      options: ["English"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-3", date: "2026-11-06" },
        { comment: "Great product, highly recommend!", commentedBy: "user-6", date: "2026-10-18" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-058",
      title: "Business Strategy Book",
      available: 24,
      price: 40,
      description: "Business strategy and leadership guide, hardcover, 290 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-058/400/400", "https://picsum.photos/seed/prod-058-alt1/400/400", "https://picsum.photos/seed/prod-058-alt2/400/400"],
      categories: ["books", "business"],
      tags: ["business", "strategy", "leadership"],
      info: [
        { infoTitle: "Pages", info: "290" },
        { infoTitle: "Format", info: "Hardcover" },
        { infoTitle: "Topic", info: "Strategy" }
      ],
      options: ["English"],
      comments: [
        { comment: "Practical insights.", commentedBy: "user-27", date: "2026-10-17" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-059",
      title: "Fantasy Novel",
      available: 31,
      price: 25,
      description: "Epic fantasy novel, paperback, 600 pages, map included.",
      pictureUrls: ["https://picsum.photos/seed/prod-059/400/400", "https://picsum.photos/seed/prod-059-alt1/400/400", "https://picsum.photos/seed/prod-059-alt2/400/400"],
      categories: ["books", "fiction"],
      tags: ["fantasy", "novel", "epic"],
      info: [
        { infoTitle: "Pages", info: "600" },
        { infoTitle: "Format", info: "Paperback" },
        { infoTitle: "Genre", info: "Epic fantasy" }
      ],
      options: ["English"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-6", date: "2026-11-27" },
        { comment: "Works as described.", commentedBy: "user-9", date: "2026-11-13" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-060",
      title: "Travel Guide",
      available: 13,
      price: 20,
      description: "City travel guide with maps and local tips, paperback, 220 pages.",
      pictureUrls: ["https://picsum.photos/seed/prod-060/400/400", "https://picsum.photos/seed/prod-060-alt1/400/400", "https://picsum.photos/seed/prod-060-alt2/400/400"],
      categories: ["books", "travel"],
      tags: ["travel", "guide", "paperback"],
      info: [
        { infoTitle: "Pages", info: "220" },
        { infoTitle: "Format", info: "Paperback" },
        { infoTitle: "Topic", info: "City guide" }
      ],
      options: ["English"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-10", date: "2026-11-14" },
        { comment: "Solid value, fast delivery.", commentedBy: "user-8", date: "2026-10-10" }
      ],
      scores: [4, 3, 4],
    },
    {
      id: "prod-061",
      title: "Building Block Set",
      available: 37,
      price: 60,
      description: "500-piece creative building block set, compatible with major brands.",
      pictureUrls: ["https://picsum.photos/seed/prod-061/400/400", "https://picsum.photos/seed/prod-061-alt1/400/400", "https://picsum.photos/seed/prod-061-alt2/400/400"],
      categories: ["toys", "building"],
      tags: ["blocks", "building", "construction"],
      info: [
        { infoTitle: "Pieces", info: "500" },
        { infoTitle: "Material", info: "ABS plastic" },
        { infoTitle: "Age", info: "6+ years" }
      ],
      options: ["Multicolor"],
      comments: [
        { comment: "Hours of fun.", commentedBy: "user-28", date: "2026-09-08" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-062",
      title: "Remote Control Car",
      available: 15,
      price: 70,
      description: "4WD remote control car with drift mode, 2.4 GHz.",
      pictureUrls: ["https://picsum.photos/seed/prod-062/400/400", "https://picsum.photos/seed/prod-062-alt1/400/400", "https://picsum.photos/seed/prod-062-alt2/400/400"],
      categories: ["toys", "rc"],
      tags: ["rc-car", "remote-control", "toy"],
      info: [
        { infoTitle: "Drive", info: "4WD" },
        { infoTitle: "Frequency", info: "2.4 GHz" },
        { infoTitle: "Age", info: "8+ years" }
      ],
      options: ["Red", "Blue", "Black"],
      comments: [
        { comment: "Good product overall.", commentedBy: "user-7", date: "2026-10-11" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-063",
      title: "Doll House",
      available: 8,
      price: 30,
      description: "3-story wooden doll house with furniture set.",
      pictureUrls: ["https://picsum.photos/seed/prod-063/400/400", "https://picsum.photos/seed/prod-063-alt1/400/400", "https://picsum.photos/seed/prod-063-alt2/400/400"],
      categories: ["toys", "dolls"],
      tags: ["doll-house", "wooden", "pretend-play"],
      info: [
        { infoTitle: "Stories", info: "3" },
        { infoTitle: "Material", info: "Wood" },
        { infoTitle: "Age", info: "3+ years" }
      ],
      options: ["Natural Wood"],
      comments: [
        { comment: "Works as described.", commentedBy: "user-10", date: "2026-10-04" },
        { comment: "Happy with this purchase.", commentedBy: "user-10", date: "2026-11-08" }
      ],
      scores: [5, 5],
    },
    {
      id: "prod-064",
      title: "Board Game",
      available: 23,
      price: 80,
      description: "Family strategy board game for 2–4 players, 60 min playtime.",
      pictureUrls: ["https://picsum.photos/seed/prod-064/400/400", "https://picsum.photos/seed/prod-064-alt1/400/400", "https://picsum.photos/seed/prod-064-alt2/400/400"],
      categories: ["toys", "games"],
      tags: ["board-game", "family", "strategy"],
      info: [
        { infoTitle: "Players", info: "2–4" },
        { infoTitle: "Playtime", info: "60 minutes" },
        { infoTitle: "Age", info: "10+ years" }
      ],
      options: ["English"],
      comments: [
        { comment: "Great game night pick.", commentedBy: "user-29", date: "2026-10-24" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-065",
      title: "Puzzle 1000 pcs",
      available: 30,
      price: 65,
      description: "1000-piece jigsaw puzzle with scenic landscape artwork.",
      pictureUrls: ["https://picsum.photos/seed/prod-065/400/400", "https://picsum.photos/seed/prod-065-alt1/400/400", "https://picsum.photos/seed/prod-065-alt2/400/400"],
      categories: ["toys", "puzzles"],
      tags: ["puzzle", "jigsaw", "leisure"],
      info: [
        { infoTitle: "Pieces", info: "1000" },
        { infoTitle: "Theme", info: "Landscape" },
        { infoTitle: "Finished size", info: "50 x 70 cm" }
      ],
      options: ["Landscape"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-9", date: "2026-11-15" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-066",
      title: "Art Set",
      available: 29,
      price: 55,
      description: "62-piece drawing and painting art set in wooden case.",
      pictureUrls: ["https://picsum.photos/seed/prod-066/400/400", "https://picsum.photos/seed/prod-066-alt1/400/400", "https://picsum.photos/seed/prod-066-alt2/400/400"],
      categories: ["toys", "art"],
      tags: ["art-set", "drawing", "painting"],
      info: [
        { infoTitle: "Pieces", info: "62" },
        { infoTitle: "Case", info: "Wooden box" },
        { infoTitle: "Contents", info: "Pencils, paints, brushes" }
      ],
      options: ["Wooden case"],
      comments: [
        { comment: "Nice gift for kids.", commentedBy: "user-30", date: "2026-08-15" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-067",
      title: "Train Set",
      available: 11,
      price: 65,
      description: "Battery-operated train set with track and accessories.",
      pictureUrls: ["https://picsum.photos/seed/prod-067/400/400", "https://picsum.photos/seed/prod-067-alt1/400/400", "https://picsum.photos/seed/prod-067-alt2/400/400"],
      categories: ["toys", "vehicles"],
      tags: ["train", "toy", "battery-operated"],
      info: [
        { infoTitle: "Power", info: "Battery" },
        { infoTitle: "Age", info: "3+ years" },
        { infoTitle: "Pieces", info: "Track + train + accessories" }
      ],
      options: ["Classic"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-8", date: "2026-10-09" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-068",
      title: "Kitchen Play Set",
      available: 20,
      price: 70,
      description: "Pretend-play kitchen set with toy pots, pans and food.",
      pictureUrls: ["https://picsum.photos/seed/prod-068/400/400", "https://picsum.photos/seed/prod-068-alt1/400/400", "https://picsum.photos/seed/prod-068-alt2/400/400"],
      categories: ["toys", "pretend-play"],
      tags: ["kitchen", "pretend-play", "toy"],
      info: [
        { infoTitle: "Pieces", info: "25+" },
        { infoTitle: "Material", info: "Plastic + wood" },
        { infoTitle: "Age", info: "3+ years" }
      ],
      options: ["Multicolor"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-9", date: "2026-11-07" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-069",
      title: "Stuffed Animal",
      available: 45,
      price: 70,
      description: "Plush stuffed animal, soft and cuddly, 30 cm tall.",
      pictureUrls: ["https://picsum.photos/seed/prod-069/400/400", "https://picsum.photos/seed/prod-069-alt1/400/400", "https://picsum.photos/seed/prod-069-alt2/400/400"],
      categories: ["toys", "plush"],
      tags: ["stuffed-animal", "plush", "gift"],
      info: [
        { infoTitle: "Height", info: "30 cm" },
        { infoTitle: "Material", info: "Plush" },
        { infoTitle: "Age", info: "0+ years" }
      ],
      options: ["Bear", "Bunny", "Dog"],
      comments: [
        { comment: "Very soft.", commentedBy: "user-31", date: "2026-11-01" }
      ],
      scores: [5, 5, 5],
    },
    {
      id: "prod-070",
      title: "Science Kit",
      available: 17,
      price: 30,
      description: "STEM science kit with 20+ experiments for curious kids.",
      pictureUrls: ["https://picsum.photos/seed/prod-070/400/400", "https://picsum.photos/seed/prod-070-alt1/400/400", "https://picsum.photos/seed/prod-070-alt2/400/400"],
      categories: ["toys", "stem"],
      tags: ["science-kit", "stem", "education"],
      info: [
        { infoTitle: "Experiments", info: "20+" },
        { infoTitle: "Age", info: "8+ years" },
        { infoTitle: "Field", info: "STEM" }
      ],
      options: ["Standard"],
      comments: [
        { comment: "Solid value, fast delivery.", commentedBy: "user-2", date: "2026-11-20" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-071",
      title: "Car Phone Holder",
      available: 58,
      price: 95,
      description: "Dashboard car phone holder with strong suction cup.",
      pictureUrls: ["https://picsum.photos/seed/prod-071/400/400", "https://picsum.photos/seed/prod-071-alt1/400/400", "https://picsum.photos/seed/prod-071-alt2/400/400"],
      categories: ["automotive", "accessories"],
      tags: ["phone-holder", "car", "accessory"],
      info: [
        { infoTitle: "Mount", info: "Suction cup" },
        { infoTitle: "Compatibility", info: "Most smartphones" },
        { infoTitle: "Adjustable", info: "Yes" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Stays put on bumpy roads.", commentedBy: "user-32", date: "2026-09-27" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-072",
      title: "Car Vacuum",
      available: 16,
      price: 270,
      description: "12V handheld car vacuum with HEPA filter and crevice tool.",
      pictureUrls: ["https://picsum.photos/seed/prod-072/400/400", "https://picsum.photos/seed/prod-072-alt1/400/400", "https://picsum.photos/seed/prod-072-alt2/400/400"],
      categories: ["automotive", "cleaning"],
      tags: ["car-vacuum", "cleaning", "accessory"],
      info: [
        { infoTitle: "Power", info: "12V car socket" },
        { infoTitle: "Filter", info: "HEPA" },
        { infoTitle: "Tool", info: "Crevice nozzle" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Good product overall.", commentedBy: "user-6", date: "2026-11-14" }
      ],
      scores: [4, 3, 4],
    },
    {
      id: "prod-073",
      title: "Seat Cushion",
      available: 33,
      price: 105,
      description: "Memory foam car seat cushion with non-slip bottom.",
      pictureUrls: ["https://picsum.photos/seed/prod-073/400/400", "https://picsum.photos/seed/prod-073-alt1/400/400", "https://picsum.photos/seed/prod-073-alt2/400/400"],
      categories: ["automotive", "interior"],
      tags: ["seat-cushion", "memory-foam", "comfort"],
      info: [
        { infoTitle: "Fill", info: "Memory foam" },
        { infoTitle: "Bottom", info: "Non-slip" },
        { infoTitle: "Cover", info: "Removable, washable" }
      ],
      options: ["Black", "Grey"],
      comments: [
        { comment: "Helps with back pain.", commentedBy: "user-33", date: "2026-10-31" }
      ],
      scores: [5, 4, 4],
    },
    {
      id: "prod-074",
      title: "Dash Cam",
      available: 10,
      price: 95,
      description: "1080p dash cam with loop recording and G-sensor.",
      pictureUrls: ["https://picsum.photos/seed/prod-074/400/400", "https://picsum.photos/seed/prod-074-alt1/400/400", "https://picsum.photos/seed/prod-074-alt2/400/400"],
      categories: ["automotive", "electronics"],
      tags: ["dash-cam", "1080p", "safety"],
      info: [
        { infoTitle: "Resolution", info: "1080p" },
        { infoTitle: "Recording", info: "Loop" },
        { infoTitle: "Sensor", info: "G-sensor" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-4", date: "2026-10-08" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-075",
      title: "Tire Pressure Gauge",
      available: 47,
      price: 225,
      description: "Digital tire pressure gauge with backlit LCD display.",
      pictureUrls: ["https://picsum.photos/seed/prod-075/400/400", "https://picsum.photos/seed/prod-075-alt1/400/400", "https://picsum.photos/seed/prod-075-alt2/400/400"],
      categories: ["automotive", "tools"],
      tags: ["tire-gauge", "digital", "maintenance"],
      info: [
        { infoTitle: "Type", info: "Digital" },
        { infoTitle: "Display", info: "Backlit LCD" },
        { infoTitle: "Units", info: "PSI, BAR, kPa, kg/cm²" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-10", date: "2026-10-21" },
        { comment: "Good product overall.", commentedBy: "user-10", date: "2026-11-01" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-076",
      title: "Car Organizer",
      available: 31,
      price: 135,
      description: "Back-seat car organizer with tablet holder and pockets.",
      pictureUrls: ["https://picsum.photos/seed/prod-076/400/400", "https://picsum.photos/seed/prod-076-alt1/400/400", "https://picsum.photos/seed/prod-076-alt2/400/400"],
      categories: ["automotive", "organizers"],
      tags: ["organizer", "car", "storage"],
      info: [
        { infoTitle: "Mount", info: "Back seat" },
        { infoTitle: "Tablet holder", info: "Yes" },
        { infoTitle: "Material", info: "Oxford fabric" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Keeps kids entertained.", commentedBy: "user-34", date: "2026-09-14" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-077",
      title: "Jump Starter",
      available: 7,
      price: 140,
      description: "Portable car jump starter, 2000 A peak, with USB output.",
      pictureUrls: ["https://picsum.photos/seed/prod-077/400/400", "https://picsum.photos/seed/prod-077-alt1/400/400", "https://picsum.photos/seed/prod-077-alt2/400/400"],
      categories: ["automotive", "tools"],
      tags: ["jump-starter", "car", "emergency"],
      info: [
        { infoTitle: "Peak current", info: "2000 A" },
        { infoTitle: "USB output", info: "Yes" },
        { infoTitle: "Use", info: "Cars up to 6L gas / 3L diesel" }
      ],
      options: ["Black/Orange"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-9", date: "2026-10-21" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-078",
      title: "Wheel Cleaning Brush",
      available: 39,
      price: 60,
      description: "Long-handled wheel cleaning brush with soft bristles.",
      pictureUrls: ["https://picsum.photos/seed/prod-078/400/400", "https://picsum.photos/seed/prod-078-alt1/400/400", "https://picsum.photos/seed/prod-078-alt2/400/400"],
      categories: ["automotive", "cleating"],
      tags: ["brush", "cleaning", "wheels"],
      info: [
        { infoTitle: "Handle", info: "Long" },
        { infoTitle: "Bristles", info: "Soft, scratch-free" },
        { infoTitle: "Use", info: "Wheels and tires" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-8", date: "2026-11-13" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-079",
      title: "Sun Shade",
      available: 44,
      price: 40,
      description: "Foldable windshield sun shade, reflective, fits most cars.",
      pictureUrls: ["https://picsum.photos/seed/prod-079/400/400", "https://picsum.photos/seed/prod-079-alt1/400/400", "https://picsum.photos/seed/prod-079-alt2/400/400"],
      categories: ["automotive", "interior"],
      tags: ["sun-shade", "windshield", "accessory"],
      info: [
        { infoTitle: "Type", info: "Foldable" },
        { infoTitle: "Coating", info: "Reflective" },
        { infoTitle: "Fit", info: "Most cars" }
      ],
      options: ["Silver/Black"],
      comments: [
        { comment: "Keeps car cool.", commentedBy: "user-35", date: "2026-10-13" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-080",
      title: "Emergency Kit",
      available: 14,
      price: 160,
      description: "70-piece car emergency kit with tools, first aid and warning triangle.",
      pictureUrls: ["https://picsum.photos/seed/prod-080/400/400", "https://picsum.photos/seed/prod-080-alt1/400/400", "https://picsum.photos/seed/prod-080-alt2/400/400"],
      categories: ["automotive", "safety"],
      tags: ["emergency-kit", "safety", "car"],
      info: [
        { infoTitle: "Pieces", info: "70+" },
        { infoTitle: "Contents", info: "Tools, first aid, warning triangle" },
        { infoTitle: "Case", info: "Carry bag" }
      ],
      options: ["Standard"],
      comments: [
        { comment: "Good product overall.", commentedBy: "user-6", date: "2026-11-15" },
        { comment: "Nice design and works well.", commentedBy: "user-6", date: "2026-10-26" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-081",
      title: "Plant Pot Set",
      available: 52,
      price: 65,
      description: "Set of 3 ceramic plant pots with drainage holes and saucers.",
      pictureUrls: ["https://picsum.photos/seed/prod-081/400/400", "https://picsum.photos/seed/prod-081-alt1/400/400", "https://picsum.photos/seed/prod-081-alt2/400/400"],
      categories: ["garden", "pots"],
      tags: ["plant-pots", "ceramic", "garden"],
      info: [
        { infoTitle: "Pieces", info: "3 pots + 3 saucers" },
        { infoTitle: "Material", info: "Ceramic" },
        { infoTitle: "Drainage", info: "Yes" }
      ],
      options: ["White", "Terracotta", "Grey"],
      comments: [
        { comment: "Nice quality ceramic.", commentedBy: "user-36", date: "2026-08-08" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-082",
      title: "Garden Hose",
      available: 12,
      price: 130,
      description: "15 m expandable garden hose with brass fittings and spray nozzle.",
      pictureUrls: ["https://picsum.photos/seed/prod-082/400/400", "https://picsum.photos/seed/prod-082-alt1/400/400", "https://picsum.photos/seed/prod-082-alt2/400/400"],
      categories: ["garden", "watering"],
      tags: ["hose", "garden", "watering"],
      info: [
        { infoTitle: "Length", info: "15 m" },
        { infoTitle: "Type", info: "Expandable" },
        { infoTitle: "Fittings", info: "Brass" }
      ],
      options: ["Green"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-6", date: "2026-10-18" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-083",
      title: "Pruning Shears",
      available: 28,
      price: 150,
      description: "Bypass pruning shears with non-stick coated blades.",
      pictureUrls: ["https://picsum.photos/seed/prod-083/400/400", "https://picsum.photos/seed/prod-083-alt1/400/400", "https://picsum.photos/seed/prod-083-alt2/400/400"],
      categories: ["garden", "tools"],
      tags: ["shears", "pruning", "garden-tools"],
      info: [
        { infoTitle: "Type", info: "Bypass" },
        { infoTitle: "Blades", info: "Non-stick coated" },
        { infoTitle: "Handle", info: "Ergonomic" }
      ],
      options: ["Black/Red"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-9", date: "2026-11-06" },
        { comment: "Great product, highly recommend!", commentedBy: "user-8", date: "2026-11-14" }
      ],
      scores: [4, 5],
    },
    {
      id: "prod-084",
      title: "Outdoor Solar Lights",
      available: 40,
      price: 70,
      description: "Set of 4 outdoor solar pathway lights, auto on/off at dusk.",
      pictureUrls: ["https://picsum.photos/seed/prod-084/400/400", "https://picsum.photos/seed/prod-084-alt1/400/400", "https://picsum.photos/seed/prod-084-alt2/400/400"],
      categories: ["garden", "lighting"],
      tags: ["solar-lights", "outdoor", "pathway"],
      info: [
        { infoTitle: "Pieces", info: "4" },
        { infoTitle: "Power", info: "Solar" },
        { infoTitle: "Sensor", info: "Dusk-to-dawn" }
      ],
      options: ["Stainless Steel", "Black"],
      comments: [
        { comment: "Bright enough for paths.", commentedBy: "user-37", date: "2026-10-06" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-085",
      title: "Garden Kneeler",
      available: 22,
      price: 75,
      description: "Foldable garden kneeler and seat with side tool pockets.",
      pictureUrls: ["https://picsum.photos/seed/prod-085/400/400", "https://picsum.photos/seed/prod-085-alt1/400/400", "https://picsum.photos/seed/prod-085-alt2/400/400"],
      categories: ["garden", "accessories"],
      tags: ["kneeler", "seat", "gardening"],
      info: [
        { infoTitle: "Use", info: "Kneeler and seat" },
        { infoTitle: "Pockets", info: "Side tool pockets" },
        { infoTitle: "Foldable", info: "Yes" }
      ],
      options: ["Green"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-4", date: "2026-10-03" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-086",
      title: "Bird Feeder",
      available: 19,
      price: 130,
      description: "Hanging bird feeder with clear reservoir and metal hanger.",
      pictureUrls: ["https://picsum.photos/seed/prod-086/400/400", "https://picsum.photos/seed/prod-086-alt1/400/400", "https://picsum.photos/seed/prod-086-alt2/400/400"],
      categories: ["garden", "wildlife"],
      tags: ["bird-feeder", "wildlife", "garden"],
      info: [
        { infoTitle: "Mount", info: "Hanging" },
        { infoTitle: "Reservoir", info: "Clear plastic" },
        { infoTitle: "Hanger", info: "Metal" }
      ],
      options: ["Clear/Red"],
      comments: [
        { comment: "Birds love it.", commentedBy: "user-38", date: "2026-09-03" }
      ],
      scores: [5, 5],
    },
    {
      id: "prod-087",
      title: "Lawn Mower",
      available: 5,
      price: 150,
      description: "Push lawn mower with 40 cm cutting width and grass catcher.",
      pictureUrls: ["https://picsum.photos/seed/prod-087/400/400", "https://picsum.photos/seed/prod-087-alt1/400/400", "https://picsum.photos/seed/prod-087-alt2/400/400"],
      categories: ["garden", "equipment"],
      tags: ["lawn-mower", "garden", "equipment"],
      info: [
        { infoTitle: "Cutting width", info: "40 cm" },
        { infoTitle: "Type", info: "Push" },
        { infoTitle: "Catcher", info: "Grass bag included" }
      ],
      options: ["Red/Black"],
      comments: [
        { comment: "Works as described.", commentedBy: "user-10", date: "2026-11-08" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-088",
      title: "Garden Tool Set",
      available: 35,
      price: 50,
      description: "5-piece garden hand tool set with canvas carry bag.",
      pictureUrls: ["https://picsum.photos/seed/prod-088/400/400", "https://picsum.photos/seed/prod-088-alt1/400/400", "https://picsum.photos/seed/prod-088-alt2/400/400"],
      categories: ["garden", "tools"],
      tags: ["tools", "set", "gardening"],
      info: [
        { infoTitle: "Pieces", info: "5" },
        { infoTitle: "Bag", info: "Canvas carry bag" },
        { infoTitle: "Tools", info: "Trowel, fork, cultivator, pruner, sprayer" }
      ],
      options: ["Set"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-6", date: "2026-10-14" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-089",
      title: "Raised Bed Kit",
      available: 8,
      price: 85,
      description: "Wooden raised garden bed kit, 120 x 60 x 30 cm, easy assembly.",
      pictureUrls: ["https://picsum.photos/seed/prod-089/400/400", "https://picsum.photos/seed/prod-089-alt1/400/400", "https://picsum.photos/seed/prod-089-alt2/400/400"],
      categories: ["garden", "beds"],
      tags: ["raised-bed", "garden", "wood"],
      info: [
        { infoTitle: "Size", info: "120 x 60 x 30 cm" },
        { infoTitle: "Material", info: "Wood" },
        { infoTitle: "Assembly", info: "Tool-free" }
      ],
      options: ["Natural Wood"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-8", date: "2026-10-12" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-090",
      title: "Watering Can",
      available: 26,
      price: 25,
      description: "5 L galvanized steel watering can with long spout.",
      pictureUrls: ["https://picsum.photos/seed/prod-090/400/400", "https://picsum.photos/seed/prod-090-alt1/400/400", "https://picsum.photos/seed/prod-090-alt2/400/400"],
      categories: ["garden", "watering"],
      tags: ["watering-can", "garden", "steel"],
      info: [
        { infoTitle: "Capacity", info: "5 L" },
        { infoTitle: "Material", info: "Galvanized steel" },
        { infoTitle: "Spout", info: "Long, detachable rose" }
      ],
      options: ["Galvanized", "Green"],
      comments: [
        { comment: "Exceeded my expectations.", commentedBy: "user-10", date: "2026-11-10" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-091",
      title: "Desk Organizer",
      available: 48,
      price: 365,
      description: "Mesh desk organizer with multiple compartments for stationery.",
      pictureUrls: ["https://picsum.photos/seed/prod-091/400/400", "https://picsum.photos/seed/prod-091-alt1/400/400", "https://picsum.photos/seed/prod-091-alt2/400/400"],
      categories: ["home", "office"],
      tags: ["organizer", "desk", "office"],
      info: [
        { infoTitle: "Material", info: "Metal mesh" },
        { infoTitle: "Compartments", info: "5+" },
        { infoTitle: "Use", info: "Stationery, notes, pens" }
      ],
      options: ["Black", "Silver"],
      comments: [
        { comment: "Tidies up the desk.", commentedBy: "user-39", date: "2026-11-03" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-092",
      title: "Yoga Block",
      available: 39,
      price: 30,
      description: "High-density foam yoga block for support and alignment.",
      pictureUrls: ["https://picsum.photos/seed/prod-092/400/400", "https://picsum.photos/seed/prod-092-alt1/400/400", "https://picsum.photos/seed/prod-092-alt2/400/400"],
      categories: ["sport", "fitness"],
      tags: ["yoga-block", "props", "exercise"],
      info: [
        { infoTitle: "Material", info: "High-density EVA foam" },
        { infoTitle: "Size", info: "23 x 15 x 7.5 cm" },
        { infoTitle: "Use", info: "Support and alignment" }
      ],
      options: ["Purple", "Blue", "Black"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-3", date: "2026-10-17" },
        { comment: "Solid value, fast delivery.", commentedBy: "user-2", date: "2026-10-12" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-093",
      title: "Electric Toothbrush",
      available: 22,
      price: 95,
      description: "Rechargeable electric toothbrush with 3 cleaning modes and 2 heads.",
      pictureUrls: ["https://picsum.photos/seed/prod-093/400/400", "https://picsum.photos/seed/prod-093-alt1/400/400", "https://picsum.photos/seed/prod-093-alt2/400/400"],
      categories: ["beauty", "oral-care"],
      tags: ["toothbrush", "electric", "oral-care"],
      info: [
        { infoTitle: "Modes", info: "3" },
        { infoTitle: "Heads", info: "2 included" },
        { infoTitle: "Power", info: "Rechargeable" }
      ],
      options: ["White", "Pink", "Blue"],
      comments: [
        { comment: "Teeth feel cleaner.", commentedBy: "user-40", date: "2026-10-21" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-094",
      title: "Wall Shelf Set",
      available: 17,
      price: 185,
      description: "Set of 3 floating wall shelves, wood finish, mounting hardware included.",
      pictureUrls: ["https://picsum.photos/seed/prod-094/400/400", "https://picsum.photos/seed/prod-094-alt1/400/400", "https://picsum.photos/seed/prod-094-alt2/400/400"],
      categories: ["home", "storage"],
      tags: ["shelves", "wall", "storage"],
      info: [
        { infoTitle: "Pieces", info: "3" },
        { infoTitle: "Material", info: "Engineered wood" },
        { infoTitle: "Hardware", info: "Included" }
      ],
      options: ["Oak", "Walnut", "White"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-10", date: "2026-11-02" },
        { comment: "Nice design and works well.", commentedBy: "user-2", date: "2026-11-04" }
      ],
      scores: [4, 4, 4],
    },
    {
      id: "prod-095",
      title: "Electric Toothbrush",
      available: 22,
      price: 55,
      description: "Rechargeable electric toothbrush with 3 cleaning modes and 2 heads.",
      pictureUrls: ["https://picsum.photos/seed/prod-095/400/400", "https://picsum.photos/seed/prod-095-alt1/400/400", "https://picsum.photos/seed/prod-095-alt2/400/400"],
      categories: ["beauty", "oral-care"],
      tags: ["toothbrush", "electric", "oral-care"],
      info: [
        { infoTitle: "Modes", info: "3" },
        { infoTitle: "Heads", info: "2 included" },
        { infoTitle: "Power", info: "Rechargeable" }
      ],
      options: ["White", "Pink", "Blue"],
      comments: [
        { comment: "Teeth feel cleaner.", commentedBy: "user-40", date: "2026-10-21" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-096",
      title: "Travel Backpack",
      available: 14,
      price: 115,
      description: "40 L travel backpack with laptop sleeve and water-resistant fabric.",
      pictureUrls: ["https://picsum.photos/seed/prod-096/400/400", "https://picsum.photos/seed/prod-096-alt1/400/400", "https://picsum.photos/seed/prod-096-alt2/400/400"],
      categories: ["fashion", "bags"],
      tags: ["travel", "backpack", "water-resistant"],
      info: [
        { infoTitle: "Capacity", info: "40 L" },
        { infoTitle: "Laptop fit", info: "up to 15.6\"" },
        { infoTitle: "Water resistant", info: "Yes" }
      ],
      options: ["Black", "Navy", "Olive"],
      comments: [
        { comment: "Perfect for weekend trips.", commentedBy: "user-41", date: "2026-09-09" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-097",
      title: "Smart Plug",
      available: 36,
      price: 1270,
      description: "Wi-Fi smart plug with app control and voice assistant compatibility.",
      pictureUrls: ["https://picsum.photos/seed/prod-097/400/400", "https://picsum.photos/seed/prod-097-alt1/400/400", "https://picsum.photos/seed/prod-097-alt2/400/400"],
      categories: ["electronics", "smart-home"],
      tags: ["smart-plug", "wifi", "home-automation"],
      info: [
        { infoTitle: "Connectivity", info: "Wi-Fi 2.4 GHz" },
        { infoTitle: "Control", info: "App + voice" },
        { infoTitle: "Rating", info: "10 A" }
      ],
      options: ["White"],
      comments: [
        { comment: "Easy to set up.", commentedBy: "user-42", date: "2026-10-18" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-098",
      title: "Desk Lamp",
      available: 30,
      price: 65,
      description: "LED desk lamp with 5 color temperatures and 7 brightness levels.",
      pictureUrls: ["https://picsum.photos/seed/prod-098/400/400", "https://picsum.photos/seed/prod-098-alt1/400/400", "https://picsum.photos/seed/prod-098-alt2/400/400"],
      categories: ["home", "lighting"],
      tags: ["desk-lamp", "led", "adjustable"],
      info: [
        { infoTitle: "Color temps", info: "5" },
        { infoTitle: "Brightness", info: "7 levels" },
        { infoTitle: "Power", info: "USB-C" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Nice design and works well.", commentedBy: "user-7", date: "2026-11-06" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-099",
      title: "Sneaker Cleaner Kit",
      available: 41,
      price: 180,
      description: "Sneaker cleaning kit with brush, foam and microfiber cloth.",
      pictureUrls: ["https://picsum.photos/seed/prod-099/400/400", "https://picsum.photos/seed/prod-099-alt1/400/400", "https://picsum.photos/seed/prod-099-alt2/400/400"],
      categories: ["fashion", "care"],
      tags: ["cleaner", "sneakers", "care"],
      info: [
        { infoTitle: "Pieces", info: "Brush, foam, cloth" },
        { infoTitle: "Use", info: "Sneakers and shoes" },
        { infoTitle: "Safe on", info: "Leather, suede, canvas" }
      ],
      options: ["Kit"],
      comments: [
        { comment: "Makes old shoes look new.", commentedBy: "user-43", date: "2026-08-22" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-100",
      title: "Insulated Water Bottle",
      available: 54,
      price: 380,
      description: "500 ml stainless steel insulated water bottle, keeps cold 24h / hot 12h.",
      pictureUrls: ["https://picsum.photos/seed/prod-100/400/400", "https://picsum.photos/seed/prod-100-alt1/400/400", "https://picsum.photos/seed/prod-100-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["water-bottle", "insulated", "stainless-steel"],
      info: [
        { infoTitle: "Capacity", info: "500 ml" },
        { infoTitle: "Material", info: "Stainless steel" },
        { infoTitle: "Insulation", info: "Cold 24h / hot 12h" }
      ],
      options: ["Black", "Silver", "Blue", "Pink"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-9", date: "2026-11-12" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-101",
      title: "Wireless Charger",
      available: 27,
      price: 1080,
      description: "10 W wireless charging pad with LED indicator and non-slip surface.",
      pictureUrls: ["https://picsum.photos/seed/prod-101/400/400", "https://picsum.photos/seed/prod-101-alt1/400/400", "https://picsum.photos/seed/prod-101-alt2/400/400"],
      categories: ["electronics", "accessories"],
      tags: ["wireless-charger", "charging", "qi"],
      info: [
        { infoTitle: "Power", info: "10 W" },
        { infoTitle: "Standard", info: "Qi" },
        { infoTitle: "Indicator", info: "LED" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Charges phone overnight fine.", commentedBy: "user-44", date: "2026-10-09" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-102",
      title: "Desk Fan",
      available: 23,
      price: 360,
      description: "Quiet USB desk fan with 3 speed settings and adjustable tilt.",
      pictureUrls: ["https://picsum.photos/seed/prod-102/400/400", "https://picsum.photos/seed/prod-102-alt1/400/400", "https://picsum.photos/seed/prod-102-alt2/400/400"],
      categories: ["home", "appliances"],
      tags: ["fan", "desk", "usb"],
      info: [
        { infoTitle: "Power", info: "USB" },
        { infoTitle: "Speeds", info: "3" },
        { infoTitle: "Tilt", info: "Adjustable" }
      ],
      options: ["White", "Black"],
      comments: [
        { comment: "Happy with this purchase.", commentedBy: "user-10", date: "2026-10-16" }
      ],
      scores: [4, 3, 4, 4],
    },
    {
      id: "prod-103",
      title: "Camera Tripod",
      available: 11,
      price: 815,
      description: "64 inch aluminum camera tripod with ball head and quick release plate.",
      pictureUrls: ["https://picsum.photos/seed/prod-103/400/400", "https://picsum.photos/seed/prod-103-alt1/400/400", "https://picsum.photos/seed/prod-103-alt2/400/400"],
      categories: ["electronics", "photography"],
      tags: ["tripod", "camera", "photography"],
      info: [
        { infoTitle: "Max height", info: "163 cm" },
        { infoTitle: "Material", info: "Aluminum" },
        { infoTitle: "Head", info: "Ball head" }
      ],
      options: ["Black"],
      comments: [
        { comment: "Good quality for the price.", commentedBy: "user-7", date: "2026-11-23" },
        { comment: "Solid value, fast delivery.", commentedBy: "user-10", date: "2026-11-02" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-104",
      title: "Bath Mat",
      available: 38,
      price: 460,
      description: "Memory foam bath mat with non-slip backing, machine washable.",
      pictureUrls: ["https://picsum.photos/seed/prod-104/400/400", "https://picsum.photos/seed/prod-104-alt1/400/400", "https://picsum.photos/seed/prod-104-alt2/400/400"],
      categories: ["home", "bath"],
      tags: ["bath-mat", "memory-foam", "bathroom"],
      info: [
        { infoTitle: "Size", info: "40 x 60 cm" },
        { infoTitle: "Fill", info: "Memory foam" },
        { infoTitle: "Backing", info: "Non-slip" }
      ],
      options: ["Grey", "White", "Navy"],
      comments: [
        { comment: "Soft underfoot.", commentedBy: "user-45", date: "2026-11-05" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-105",
      title: "Makeup Mirror",
      available: 20,
      price: 35,
      description: "LED lighted makeup mirror with 1x/10x magnification and touch control.",
      pictureUrls: ["https://picsum.photos/seed/prod-105/400/400", "https://picsum.photos/seed/prod-105-alt1/400/400", "https://picsum.photos/seed/prod-105-alt2/400/400"],
      categories: ["beauty", "tools"],
      tags: ["mirror", "makeup", "led"],
      info: [
        { infoTitle: "Magnification", info: "1x / 10x" },
        { infoTitle: "Light", info: "LED" },
        { infoTitle: "Control", info: "Touch" }
      ],
      options: ["White", "Rose Gold"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-3", date: "2026-11-15" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-106",
      title: "Luggage Set",
      available: 6,
      price: 50,
      description: "3-piece hardside luggage set with spinner wheels and TSA lock.",
      pictureUrls: ["https://picsum.photos/seed/prod-106/400/400", "https://picsum.photos/seed/prod-106-alt1/400/400", "https://picsum.photos/seed/prod-106-alt2/400/400"],
      categories: ["fashion", "travel"],
      tags: ["luggage", "suitcase", "travel"],
      info: [
        { infoTitle: "Pieces", info: "3" },
        { infoTitle: "Wheels", info: "360° spinner" },
        { infoTitle: "Lock", info: "TSA combination" }
      ],
      options: ["Black", "Blue", "Red"],
      comments: [
        { comment: "Solid value, fast delivery.", commentedBy: "user-6", date: "2026-10-16" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-107",
      title: "Sewing Kit",
      available: 33,
      price: 125,
      description: "120-piece sewing kit with threads, needles, scissors and buttons.",
      pictureUrls: ["https://picsum.photos/seed/prod-107/400/400", "https://picsum.photos/seed/prod-107-alt1/400/400", "https://picsum.photos/seed/prod-107-alt2/400/400"],
      categories: ["home", "crafts"],
      tags: ["sewing-kit", "crafts", "repair"],
      info: [
        { infoTitle: "Pieces", info: "120+" },
        { infoTitle: "Contents", info: "Threads, needles, scissors, buttons" },
        { infoTitle: "Case", info: "Compact box" }
      ],
      options: ["Standard"],
      comments: [
        { comment: "Would buy again.", commentedBy: "user-4", date: "2026-10-04" },
        { comment: "Good quality for the price.", commentedBy: "user-3", date: "2026-11-26" }
      ],
      scores: [4, 4],
    },
    {
      id: "prod-108",
      title: "Picnic Blanket",
      available: 25,
      price: 165,
      description: "Waterproof picnic blanket with carry strap and sand-proof backing.",
      pictureUrls: ["https://picsum.photos/seed/prod-108/400/400", "https://picsum.photos/seed/prod-108-alt1/400/400", "https://picsum.photos/seed/prod-108-alt2/400/400"],
      categories: ["sport", "outdoor"],
      tags: ["picnic", "blanket", "outdoor"],
      info: [
        { infoTitle: "Size", info: "200 x 200 cm" },
        { infoTitle: "Waterproof", info: "Yes" },
        { infoTitle: "Strap", info: "Carry strap included" }
      ],
      options: ["Blue", "Green", "Red"],
      comments: [
        { comment: "Great for beach days.", commentedBy: "user-46", date: "2026-09-16" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-109",
      title: "First Aid Kit",
      available: 29,
      price: 115,
      description: "100-piece first aid kit for home, car and travel.",
      pictureUrls: ["https://picsum.photos/seed/prod-109/400/400", "https://picsum.photos/seed/prod-109-alt1/400/400", "https://picsum.photos/seed/prod-109-alt2/400/400"],
      categories: ["home", "safety"],
      tags: ["first-aid", "safety", "emergency"],
      info: [
        { infoTitle: "Pieces", info: "100+" },
        { infoTitle: "Use", info: "Home, car, travel" },
        { infoTitle: "Case", info: "Hard shell" }
      ],
      options: ["Standard"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-4", date: "2026-10-19" }
      ],
      scores: [4, 5, 4],
    },
    {
      id: "prod-110",
      title: "Candle Set",
      available: 42,
      price: 210,
      description: "Scented candle set of 4, soy wax, 8 oz each, gift boxed.",
      pictureUrls: ["https://picsum.photos/seed/prod-110/400/400", "https://picsum.photos/seed/prod-110-alt1/400/400", "https://picsum.photos/seed/prod-110-alt2/400/400"],
      categories: ["home", "decor"],
      tags: ["candle", "scented", "gift"],
      info: [
        { infoTitle: "Pieces", info: "4" },
        { infoTitle: "Wax", info: "Soy" },
        { infoTitle: "Size", info: "8 oz each" }
      ],
      options: ["Lavender", "Vanilla", "Citrus", "Sandalwood"],
      comments: [
        { comment: "Smells amazing.", commentedBy: "user-47", date: "2026-10-25" }
      ],
      scores: [5, 5, 5],
    },
    {
      id: "prod-111",
      title: "Tool Kit",
      available: 15,
      price: 115,
      description: "45-piece household tool kit with hammer, screwdrivers, pliers and tape.",
      pictureUrls: ["https://picsum.photos/seed/prod-111/400/400", "https://picsum.photos/seed/prod-111-alt1/400/400", "https://picsum.photos/seed/prod-111-alt2/400/400"],
      categories: ["home", "tools"],
      tags: ["tool-kit", "household", "repair"],
      info: [
        { infoTitle: "Pieces", info: "45" },
        { infoTitle: "Contents", info: "Hammer, screwdrivers, pliers, tape measure" },
        { infoTitle: "Case", info: "Blow-molded case" }
      ],
      options: ["Standard"],
      comments: [
        { comment: "Impressed with the quality.", commentedBy: "user-8", date: "2026-10-14" },
        { comment: "Happy with this purchase.", commentedBy: "user-6", date: "2026-11-16" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-112",
      title: "Pet Bed",
      available: 18,
      price: 400,
      description: "Plush pet bed with removable washable cover, non-slip bottom.",
      pictureUrls: ["https://picsum.photos/seed/prod-112/400/400", "https://picsum.photos/seed/prod-112-alt1/400/400", "https://picsum.photos/seed/prod-112-alt2/400/400"],
      categories: ["home", "pets"],
      tags: ["pet-bed", "dog", "cat"],
      info: [
        { infoTitle: "Size", info: "Medium" },
        { infoTitle: "Cover", info: "Removable, washable" },
        { infoTitle: "Bottom", info: "Non-slip" }
      ],
      options: ["Grey", "Brown"],
      comments: [
        { comment: "My dog loves it.", commentedBy: "user-48", date: "2026-11-07" }
      ],
      scores: [5, 4, 5],
    },
    {
      id: "prod-113",
      title: "Bluetooth Headphones",
      available: 31,
      price: 880,
      description: "On-ear Bluetooth headphones with built-in mic and 20h battery.",
      pictureUrls: ["https://picsum.photos/seed/prod-113/400/400", "https://picsum.photos/seed/prod-113-alt1/400/400", "https://picsum.photos/seed/prod-113-alt2/400/400"],
      categories: ["electronics", "audio"],
      tags: ["bluetooth", "headphones", "on-ear"],
      info: [
        { infoTitle: "Battery life", info: "20 hours" },
        { infoTitle: "Mic", info: "Built-in" },
        { infoTitle: "Connectivity", info: "Bluetooth 5.0" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-8", date: "2026-11-25" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-114",
      title: "Desk Calendar",
      available: 50,
      price: 40,
      description: "Stand-up desk calendar with daily tear-off pages and note space.",
      pictureUrls: ["https://picsum.photos/seed/prod-114/400/400", "https://picsum.photos/seed/prod-114-alt1/400/400", "https://picsum.photos/seed/prod-114-alt2/400/400"],
      categories: ["home", "office"],
      tags: ["calendar", "desk", "planner"],
      info: [
        { infoTitle: "Type", info: "Tear-off daily" },
        { infoTitle: "Stand", info: "Included" },
        { infoTitle: "Year", info: "2027" }
      ],
      options: ["2027"],
      comments: [
        { comment: "Great product, highly recommend!", commentedBy: "user-6", date: "2026-11-10" }
      ],
      scores: [3, 4, 4],
    },
    {
      id: "prod-115",
      title: "Hair Straightener",
      available: 13,
      price: 55,
      description: "Ceramic hair straightener with adjustable temperature up to 230°C.",
      pictureUrls: ["https://picsum.photos/seed/prod-115/400/400", "https://picsum.photos/seed/prod-115-alt1/400/400", "https://picsum.photos/seed/prod-115-alt2/400/400"],
      categories: ["beauty", "hair"],
      tags: ["straightener", "hair", "styling"],
      info: [
        { infoTitle: "Plates", info: "Ceramic" },
        { infoTitle: "Max temp", info: "230°C" },
        { infoTitle: "Heat up", info: "30 seconds" }
      ],
      options: ["Black", "Pink"],
      comments: [
        { comment: "Good quality for the price.", commentedBy: "user-9", date: "2026-10-14" }
      ],
      scores: [5, 4, 4],
    },
    {
      id: "prod-116",
      title: "Water Flosser",
      available: 19,
      price: 65,
      description: "Cordless water flosser with 3 modes and 4 jet tips.",
      pictureUrls: ["https://picsum.photos/seed/prod-116/400/400", "https://picsum.photos/seed/prod-116-alt1/400/400", "https://picsum.photos/seed/prod-116-alt2/400/400"],
      categories: ["beauty", "oral-care"],
      tags: ["water-flosser", "oral-care", "cordless"],
      info: [
        { infoTitle: "Modes", info: "3" },
        { infoTitle: "Tips", info: "4" },
        { infoTitle: "Power", info: "Rechargeable" }
      ],
      options: ["White", "Blue"],
      comments: [
        { comment: "Gums feel healthier.", commentedBy: "user-49", date: "2026-08-31" }
      ],
      scores: [4, 5, 5],
    },
    {
      id: "prod-117",
      title: "Gaming Headset",
      available: 24,
      price: 550,
      description: "Over-ear gaming headset with noise mic, RGB lights and 3.5 mm jack.",
      pictureUrls: ["https://picsum.photos/seed/prod-117/400/400", "https://picsum.photos/seed/prod-117-alt1/400/400", "https://picsum.photos/seed/prod-117-alt2/400/400"],
      categories: ["electronics", "gaming"],
      tags: ["headset", "gaming", "rgb"],
      info: [
        { infoTitle: "Mic", info: "Noise-cancelling" },
        { infoTitle: "Lights", info: "RGB" },
        { infoTitle: "Connection", info: "3.5 mm jack" }
      ],
      options: ["Black", "White"],
      comments: [
        { comment: "Comfortable for long sessions.", commentedBy: "user-50", date: "2026-10-11" }
      ],
      scores: [4, 4, 5],
    },
    {
      id: "prod-118",
      title: "Wall Mirror",
      available: 9,
      price: 495,
      description: "Full-length wall mirror with aluminum frame and shatter-proof glass.",
      pictureUrls: ["https://picsum.photos/seed/prod-118/400/400", "https://picsum.photos/seed/prod-118-alt1/400/400", "https://picsum.photos/seed/prod-118-alt2/400/400"],
      categories: ["home", "decor"],
      tags: ["mirror", "wall", "full-length"],
      info: [
        { infoTitle: "Size", info: "160 x 60 cm" },
        { infoTitle: "Frame", info: "Aluminum" },
        { infoTitle: "Glass", info: "Shatter-proof" }
      ],
      options: ["Silver", "Black", "Gold"],
      comments: [
        { comment: "Solid value, fast delivery.", commentedBy: "user-3", date: "2026-11-19" }
      ],
      scores: [5, 5, 4],
    },
    {
      id: "prod-119",
      title: "Electric Kettle",
      available: 33,
      price: 125,
      description: "1.7 L electric kettle with auto shut-off and boil-dry protection.",
      pictureUrls: ["https://picsum.photos/seed/prod-119/400/400", "https://picsum.photos/seed/prod-119-alt1/400/400", "https://picsum.photos/seed/prod-119-alt2/400/400"],
      categories: ["home", "kitchen"],
      tags: ["kettle", "electric", "kitchen"],
      info: [
        { infoTitle: "Capacity", info: "1.7 L" },
        { infoTitle: "Power", info: "1500 W" },
        { infoTitle: "Safety", info: "Auto shut-off" }
      ],
      options: ["Stainless Steel", "Black", "White"],
      comments: [
        { comment: "Boils water quickly.", commentedBy: "user-51", date: "2026-10-05" }
      ],
      scores: [5, 4],
    },
    {
      id: "prod-120",
      title: "Desk Mat",
      available: 44,
      price: 430,
      description: "Large leatherette desk mat for keyboard and mouse, water-resistant.",
      pictureUrls: ["https://picsum.photos/seed/prod-120/400/400", "https://picsum.photos/seed/prod-120-alt1/400/400", "https://picsum.photos/seed/prod-120-alt2/400/400"],
      categories: ["home", "office"],
      tags: ["desk-mat", "office", "keyboard"],
      info: [
        { infoTitle: "Size", info: "80 x 40 cm" },
        { infoTitle: "Material", info: "Leatherette" },
        { infoTitle: "Water resistant", info: "Yes" }
      ],
      options: ["Brown", "Black"],
      comments: [
        { comment: "Good product overall.", commentedBy: "user-8", date: "2026-10-19" }
      ],
      scores: [4, 4, 5],
    }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${MONGO_URI}`);

    // Clear existing products so the seed is idempotent
    const deleted = await Product.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing products`);

    const inserted = await Product.insertMany(seedProducts);
    console.log(`Seeded ${inserted.length} products:`);
    inserted.forEach((p) => console.log(` - ${p.id}: ${p.title} (${p.categories.join(", ")})`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
