const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const http = require("http");
const socketIO = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);


const allowedOrigins = [
  "https://bastard.fun",
  "https://www.bastard.fun",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());


app.use(express.urlencoded({ extended: false }));


if (!process.env.SESSION_SECRET) {
  console.warn("⚠️ SESSION_SECRET is not set. This is unsafe for production.");
}

app.use(
  session({
    name: "bastard.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);


require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());


const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);


app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));


app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});


app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


global.emitOrderUpdate = (order) => {
  io.emit("orderUpdate", order);
};


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
