const express = require("express");
const morgan = require("morgan");
const path = require("path");

const pageRouter = require("./routers/pageRouter");
const apiRouter = require("./routers/apiRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", pageRouter);
app.use("/api", apiRouter);

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and message."
    });
  }

  console.log("Contact submission:", {
    name,
    email,
    message,
    receivedAt: new Date().toISOString()
  });

  return res.status(200).json({
    success: true,
    message: `Thank you, ${name}! We have received your message.`
  });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
