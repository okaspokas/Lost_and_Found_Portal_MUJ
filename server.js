const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname)));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

const DATA_PATH = path.resolve(__dirname, "data.json");
const UPLOADS_PATH = path.resolve(__dirname, "uploads");

(async () => {
  await fs.ensureDir(UPLOADS_PATH);
  if (await fs.pathExists(DATA_PATH)) {
    items = await fs.readJson(DATA_PATH);
  } else {
    items = [];
    await fs.writeJson(DATA_PATH, items, { spaces: 2 });
  }
})();

let items = [];

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.get("/items", (req, res) => {
  res.json(items);
});

const storage = multer.diskStorage({
  destination: async (req, file, cb) => cb(null, UPLOADS_PATH),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Not an image'), false);
  }
});

app.post("/items", upload.single('image'), async (req, res) => {
  try {
    const newItem = {
      id: Date.now(),
      type: req.body.type,
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      contact: req.body.contact,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      timestamp: parseInt(req.body.timestamp)
    };

    // Resize image if uploaded
    if (req.file) {
      const inputPath = path.resolve(UPLOADS_PATH, req.file.filename);
      const outputPath = inputPath.replace(path.extname(req.file.filename), '.jpg');
      await sharp(inputPath)
        .resize(400, 400, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
      newItem.image = `/uploads/${path.basename(outputPath)}`;
      await fs.remove(inputPath);
    }

    items.unshift(newItem);
    await fs.writeJson(DATA_PATH, items, { spaces: 2 });

    res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save item' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await fs.writeJson(DATA_PATH, items, { spaces: 2 });
  console.log('Data saved, server shutting down');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
