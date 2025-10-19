"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const videoCardController_1 = require("../controllers/videoCardController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads/youtube"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/", videoCardController_1.getAllVideoCards);
router.post("/", upload.single("image"), videoCardController_1.createVideoCard);
router.put("/:id", upload.single("image"), videoCardController_1.updateVideoCard);
router.delete("/:id", videoCardController_1.deleteVideoCard);
exports.default = router;
