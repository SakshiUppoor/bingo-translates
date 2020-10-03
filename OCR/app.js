const express = require("express");
const fs = require("fs");
const multer = require("multer");
const { createWorker } = require("tesseract.js");
// const { Tesseract } = require("tesseract.js");

const worker = createWorker({
  logger: (m) => console.log(m),
});
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("avatar");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    (async () => {
      fs.readFile(`./uploads/${req.file.originalname}`, async (err, file) => {
        if (err) return console.log("Your Error", err);

        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(file);
        console.log(text);
        await worker.terminate();
        res.send(text);
      });
    })();
  });
});

app.listen(5000, () => console.log("Up at port 5000"));
