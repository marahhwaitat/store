import * as express from "express";
import multer from "multer";

import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import * as dotenv from "dotenv";
import categoryRoutes from "./routes/category.routes";

import documentRouter from "./routes/document.routes";
import cartRouter from "./routes/cart.routes";
import orderRouter from "./routes/order.routes";
import path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/** MiddleWares */
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "../uploads")));

/** Routes */
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRouter);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/orders", orderRouter);

app.use("/api/carts", cartRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MySQL with TypeORM");
    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(" Error connecting to DB:", error);
  });
  