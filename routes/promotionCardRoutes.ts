import express from "express";
import multer from "multer";
import path from "path";
import {
  createPromotionCard,
  getAllPromotionCards,
  deletePromotionCard,
  updatePromotionCard,
} from "../controllers/promotionCardController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/bonuslar"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/", getAllPromotionCards);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "modalImage", maxCount: 1 },
  ]),
  createPromotionCard
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "modalImage", maxCount: 1 },
  ]),
  updatePromotionCard
);

router.delete("/:id", deletePromotionCard);

export default router;
