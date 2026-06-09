import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import ApiError from '../utils/apiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export const uploadToCloud = async (filePath, folder = 'eshop') => {
  if (isCloudinaryConfigured()) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `eshop_online/${folder}`,
      resource_type: 'image',
    });
    fs.unlink(filePath, () => {});
    return { url: result.secure_url, publicId: result.public_id };
  }

  const relativePath = `/uploads/${path.basename(filePath)}`;
  return { url: relativePath, publicId: null };
};

export const uploadMultipleToCloud = async (files, folder = 'eshop') => {
  const results = await Promise.all(
    files.map((file) => uploadToCloud(file.path, folder))
  );
  return results.map((r) => r.url);
};

export const deleteFromCloud = async (publicId) => {
  if (publicId && isCloudinaryConfigured()) {
    await cloudinary.uploader.destroy(publicId);
  }
};
