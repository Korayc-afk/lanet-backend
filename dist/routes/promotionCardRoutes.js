"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promotionCardController_1 = require("../controllers/promotionCardController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads/bonuslar"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/", promotionCardController_1.getAllPromotionCards);
router.post("/", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "modalImage", maxCount: 1 },
]), promotionCardController_1.createPromotionCard);
router.put("/:id", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "modalImage", maxCount: 1 },
]), promotionCardController_1.updatePromotionCard);
router.delete("/:id", promotionCardController_1.deletePromotionCard);
exports.default = router;
