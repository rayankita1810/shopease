import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import csvParser from "csv-parser";
import streamifier from "streamifier";

export const addProductsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const products = [];

    streamifier
      .createReadStream(req.file.buffer)
      .pipe(csvParser())
      .on("data", (row) => {
        // console.log(row);
        products.push({
          name: row.name?.trim(),
          description: row.description?.trim(),
          price: Number(row.price),
          category: row.category?.trim().toLowerCase(),
          stock: Number(row.stock),
          image: row.image?.trim(),

          seller: req.user._id,

          status: "pending",

          isTrending: row.isTrending?.toLowerCase() === "true",
        });
      })
      .on("end", async () => {
        await Product.insertMany(products);

        res.status(201).json({
          message: "CSV uploaded successfully",
          count: products.length,
        });
      });
  } catch (err) {
    console.error("CSV ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🏪 Add Product (Seller/Admin)
export const addProduct = async (req, res) => {
  try {
    // console.log("🔥 CONTROLLER HIT");
    // console.log("FILE:", req.file);

    const { name, description, price, category, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // 🔥 Upload to Cloudinary using stream
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const uploadedImage = await uploadFromBuffer();

    const product = await Product.create({
      name,
      description,
      price,
      category: category.toLowerCase(),
      stock,
      image: uploadedImage.secure_url,
      seller: req.user._id,
      status: "pending",
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📦 Get All Products (Public)
export const getProducts = async (req, res) => {
  try {
    const query = {
      status: "approved",
    };

    // ✅ CATEGORY FILTER
    if (req.query.category) {
      query.category = req.query.category.toLowerCase();
    }

    const products = await Product.find(query).populate("seller", "name email");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 📦 Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.user.role === "seller") {
      if (product.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔎 Search Products
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword) return res.json([]);

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔴 Pending Products (Admin)
export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Approve Product
export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "approved";
    await product.save();

    res.json({ message: "Product approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Reject Product (SOFT DELETE / STATUS UPDATE)
export const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "rejected";
    await product.save();

    res.json({ message: "Product marked as rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const trendingProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.isTrending = !product.isTrending;
  await product.save();

  res.json(product);
};
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isTrending: true,
    }).limit(10);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trending products",
    });
  }
};
