const express = require("express");
const cors = require("cors");
const Dotenv = require("dotenv");
const userRouter = require("./src/router/userRouter");
const { connectDB } = require("./src/config/db");
const supportRouter = require("./src/router/supportRouter");
const planRouter = require("./src/router/planRouter");
const notificationRouter = require("./src/router/notificationRouter");
const orderRouter = require("./src/router/orderRouter")
Dotenv.config();
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://befreetraining.net",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://7125bce4-753c-4e16-b02e-d5bbd340eda3-00-2ojlk0ircnnqe.pike.replit.dev"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/orders",orderRouter)
app.use("/api/v1/support", supportRouter)
app.use("/api/v1/plans",planRouter)
app.use("/api/v1/notifications",notificationRouter)

app.get("/", (req, res) => {
  console.log("befree API running");
  res.send("befree API running");
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 1234;
    app.listen(port, () => {
      console.log("Listening at", port);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
  }
};

startServer();
