import express from "express";
import multer from "multer";
import path from "path";
import {
  createMainCard,
  getMainCards,
  updateMainCard,
  deleteMainCard,
} from "../controllers/mainCardController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/maincards"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", getMainCards);
router.post("/", upload.fields([
  { name: "imageFile", maxCount: 1 },
  { name: "logoFile", maxCount: 1 }
]), createMainCard);
router.put("/:id", upload.fields([
  { name: "imageFile", maxCount: 1 },
  { name: "logoFile", maxCount: 1 }
]), updateMainCard);
router.delete("/:id", deleteMainCard);

export default router;
