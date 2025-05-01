const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Basic GET route to check server status
app.get("/", (req, res) => {
  res.send("Interview AI server connected ✅");
});

// Include your OpenAI session route
const openaiSessionRoute = require("./express-openai-realtime");
app.use(openaiSessionRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
