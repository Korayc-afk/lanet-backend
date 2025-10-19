"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const marqueeController_1 = require("../controllers/marqueeController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // uploads/marquee klasörünün Backend klasöründen doğru yolu
        cb(null, path_1.default.resolve("uploads/marquee"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/", marqueeController_1.getMarquees);
router.post("/", upload.single("file"), marqueeController_1.createMarquee);
router.put("/:id", marqueeController_1.toggleMarqueeStatus);
router.delete("/:id", marqueeController_1.deleteMarquee);
exports.default = router;
