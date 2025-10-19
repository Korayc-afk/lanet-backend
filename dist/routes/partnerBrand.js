"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../src/middleware/upload.middleware");
const partnerBrandController_1 = require("../controllers/partnerBrandController");
const router = express_1.default.Router();
const upload = (0, upload_middleware_1.getUploadMiddleware)("partnerbrands");
router.get("/", partnerBrandController_1.getPartnerBrands);
router.post("/", upload.single("file"), partnerBrandController_1.createPartnerBrand);
router.put("/:id", upload.single("file"), partnerBrandController_1.togglePartnerBrandStatus);
router.delete("/:id", partnerBrandController_1.deletePartnerBrand);
exports.default = router;
