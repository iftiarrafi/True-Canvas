import multer from "multer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const uploadDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (!imageTypes.has(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
        }
        cb(null, true);
    }
})
