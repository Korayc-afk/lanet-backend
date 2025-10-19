import express from "express";
import multer from "multer";
import path from "path";
import {
  getMarquees,
  createMarquee,
  toggleMarqueeStatus,
  deleteMarquee,
} from "../controllers/marqueeController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // uploads/marquee klasörünün Backend klasöründen doğru yolu
    cb(null, path.resolve("uploads/marquee"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getMarquees);
router.post("/", upload.single("file"), createMarquee);
router.put("/:id", toggleMarqueeStatus);
router.delete("/:id", deleteMarquee);

export default router;
