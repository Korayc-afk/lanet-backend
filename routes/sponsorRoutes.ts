import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  setAsMainSponsor,
} from "../controllers/sponsorController";

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads/sponsors");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// API Routes
router.get("/", getSponsors);

router.post(
  "/",
  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "logoFile", maxCount: 1 },
  ]),
  createSponsor
);

router.put(
  "/:id",
  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "logoFile", maxCount: 1 },
  ]),
  updateSponsor
);

router.patch("/:id/set-main", setAsMainSponsor);
router.delete("/:id", deleteSponsor);

export default router;
