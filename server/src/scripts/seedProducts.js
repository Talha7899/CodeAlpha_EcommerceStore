
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/productModel");

const sampleProducts = [
  {
    name: "Wireless Headphones",
    description:
      "Comfortable wireless headphones with clear sound and deep bass.",
    price: 4500,
    category: "Electronics",
    image: "https://placehold.co/600x600?text=Headphones",
    stock: 25,
    rating: 4.5,
    featured: true,
  },
  {
    name: "Smart Watch",
    description:
      "Modern smartwatch for everyday activity and notifications.",
    price: 6500,
    category: "Electronics",
    image: "https://placehold.co/600x600?text=Smart+Watch",
    stock: 18,
    rating: 4.2,
    featured: true,
  },
  {
    name: "Classic Sneakers",
    description:
      "Everyday sneakers designed for comfort and casual outfits.",
    price: 5200,
    category: "Fashion",
    image: "https://placehold.co/600x600?text=Sneakers",
    stock: 30,
    rating: 4.3,
    featured: false,
  },
  {
    name: "Travel Backpack",
    description:
      "A practical backpack for daily use, study, and travel.",
    price: 3200,
    category: "Accessories",
    image: "https://placehold.co/600x600?text=Backpack",
    stock: 15,
    rating: 4.0,
    featured: false,
  },
  {
    name: "Desk Lamp",
    description:
      "A minimalist desk lamp for your workspace or study table.",
    price: 2400,
    category: "Home",
    image: "https://placehold.co/600x600?text=Desk+Lamp",
    stock: 20,
    rating: 4.1,
    featured: true,
  },
  {
    name: "Classic T-Shirt",
    description:
      "A versatile everyday T-shirt with a simple, comfortable fit.",
    price: 1800,
    category: "Fashion",
    image: "https://placehold.co/600x600?text=T-Shirt",
    stock: 40,
    rating: 4.0,
    featured: false,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const product of sampleProducts) {
      await Product.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true, runValidators: true }
      );
    }

    console.log(
      `${sampleProducts.length} sample products inserted or updated.`
    );
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();