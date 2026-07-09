import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/render", async (req, res) => {
  // TODO: implement server-side PDF rendering with Playwright
  res.json({ status: "not implemented", body: req.body });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`PDF worker listening on port ${port}`);
});
