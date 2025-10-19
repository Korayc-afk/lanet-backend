"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sponsorController_1 = require("../controllers/sponsorController");
const router = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, "../uploads/sponsors");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({ storage });
// API Routes
router.get("/", sponsorController_1.getSponsors);
router.post("/", upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "logoFile", maxCount: 1 },
]), sponsorController_1.createSponsor);
router.put("/:id", upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "logoFile", maxCount: 1 },
]), sponsorController_1.updateSponsor);
router.patch("/:id/set-main", sponsorController_1.setAsMainSponsor);
router.delete("/:id", sponsorController_1.deleteSponsor);
exports.default = router;
