import express from "express";
import { getUploadMiddleware } from "../src/middleware/upload.middleware";
import {
  getPartnerBrands,
  createPartnerBrand,
  togglePartnerBrandStatus,
  deletePartnerBrand
} from "../controllers/partnerBrandController";


const router = express.Router();
const upload = getUploadMiddleware("partnerbrands");

router.get("/", getPartnerBrands);
router.post("/", upload.single("file"), createPartnerBrand);
router.put("/:id", upload.single("file"), togglePartnerBrandStatus);
router.delete("/:id", deletePartnerBrand);

export default router;
