import express from "express";
import { pagesRouter } from "./routes/pages.routes.js";
import {cart_app} from "./routes/cart.routes.js"
import {product_app} from "./routes/products.routes.js"
import cookieParser from "cookie-parser"
import {auth_app} from "./routes/auth.routes.js"
import {order_app} from "./routes/orders.routes.js"
import { check_auth } from "./middleware/checkAuth.js"
import { check_role } from "./middleware/checkRole.js"
process.loadEnvFile();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

//TODO: mount your API routers here
app.use("/auth", auth_app);
app.use("/api/products", product_app);
app.use("/api/cart",  check_auth,check_role("customer"), cart_app);
app.use("/api/orders",check_auth,check_role("customer"), order_app);
//app.use("/api/debug", debugRouter);

app.use(pagesRouter);

app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ error: "something went wrong" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
