"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const mainCardController_1 = require("../controllers/mainCardController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads/maincards"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/", mainCardController_1.getMainCards);
router.post("/", upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "logoFile", maxCount: 1 }
]), mainCardController_1.createMainCard);
router.put("/:id", upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "logoFile", maxCount: 1 }
]), mainCardController_1.updateMainCard);
router.delete("/:id", mainCardController_1.deleteMainCard);
exports.default = router;
