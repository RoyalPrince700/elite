import express from 'express';
import {
  uploadPhotos,
  getUserPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  getOptimizedImageUrl,
  getThumbnailUrl
} from '../controllers/photoController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All photo routes require authentication
router.use(authenticateToken);

// Routes
router.post('/upload', upload.single('photo'), uploadPhotos);
router.get('/', getUserPhotos);
router.get('/:id', getPhoto);
router.put('/:id', updatePhoto);
router.delete('/:id', deletePhoto);
router.get('/:id/optimized', getOptimizedImageUrl);
router.get('/:id/thumbnail', getThumbnailUrl);


export default router;
