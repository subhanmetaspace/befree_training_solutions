const express = require("express");
const cors = require("cors");
const Dotenv = require("dotenv");
const userRouter = require("./src/router/userRouter");
const { connectDB } = require("./src/config/db");
const supportRouter = require("./src/router/supportRouter");
const planRouter = require("./src/router/planRouter");
const notificationRouter = require("./src/router/notificationRouter");

Dotenv.config();
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://makerbatech.com",
        "http://localhost:3000"
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
app.use("/api/v1/support", supportRouter)
app.use("/api/v1/plans",planRouter)
app.use("/api/v1/notifications",notificationRouter)

app.get("/", (req, res) => {
  console.log("web hosting API running");
  res.send("Web hosting API running");
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
