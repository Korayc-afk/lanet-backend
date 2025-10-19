import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllVideoCards,
  createVideoCard,
  updateVideoCard,
  deleteVideoCard,
} from "../controllers/videoCardController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/youtube"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", getAllVideoCards);
router.post("/", upload.single("image"), createVideoCard);
router.put("/:id", upload.single("image"), updateVideoCard);
router.delete("/:id", deleteVideoCard);

export default router;
