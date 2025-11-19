import { body, validationResult } from 'express-validator';

const sanitizeRichText = (value = '') => {
  if (typeof value !== 'string') return '';

  const originalLength = value.length;
  let sanitized = value
    // Strip script/style tags
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    // Remove inline event handlers
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    // Prevent javascript: links
    .replace(/javascript:/gi, '')
    // Trim excessive whitespace
    .trim();

  return sanitized;
};

const normalizeTags = (value) => {
  if (!value) return [];

  const sanitizeArray = (arr) => arr
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter(Boolean);

  if (Array.isArray(value)) {
    return sanitizeArray(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return sanitizeArray(parsed);
        }
      } catch (error) {
        console.warn('⚠️ [normalizeTags] Failed to parse JSON tags string:', error.message);
      }
    }

    return trimmed
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeOptionalString = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  const result = trimmed.length ? trimmed : undefined;
  return result;
};

const commonRules = [
  body('metaDescription')
    .optional()
    .customSanitizer(normalizeOptionalString)
    .isLength({ max: 180 })
    .withMessage('Meta description must be under 180 characters'),
  body('tags')
    .optional()
    .customSanitizer(normalizeTags)
    .isArray({ max: 10 })
    .withMessage('Provide up to 10 tags'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters'),
  body('headerImage')
    .optional()
    .customSanitizer(normalizeOptionalString)
    .custom((value, { req }) => {
      // Skip URL validation if a file is being uploaded via multer
      // Multer will handle file validation separately
      if (req.file || !value) {
        return true;
      }
      // Only validate as URL if it's a string value (not a file upload)
      if (typeof value === 'string' && value.trim()) {
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(value)) {
          throw new Error('Header image must be a valid URL');
        }
      }
      return true;
    })
    .withMessage('Header image must be a valid URL or file upload'),
  body('published')
    .optional()
    .customSanitizer((value) => {
      // Handle string boolean values from FormData
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (typeof value === 'boolean') return value;
      return undefined;
    })
    .isBoolean()
    .withMessage('Published must be a boolean value')
];

const blogCreateRules = [
  body('title')
    .optional()
    .customSanitizer(normalizeOptionalString)
    .isLength({ min: 0, max: 150 })
    .withMessage('Title must be under 150 characters'),
  body('subheading')
    .optional()
    .customSanitizer(normalizeOptionalString)
    .isLength({ max: 200 })
    .withMessage('Subheading must be under 200 characters'),
  body('content')
    .optional()
    .customSanitizer(sanitizeRichText)
    .isLength({ min: 0 })
    .withMessage('Content length is limited'),
  ...commonRules
];

const blogUpdateRules = [
  body('title')
    .optional()
    .customSanitizer(normalizeOptionalString)
    .isLength({ min: 0, max: 150 })
    .withMessage('Title must be under 150 characters'),
  body('subheading')
    .optional()
    .customSanitizer(normalizeOptionalString)
    .isLength({ max: 200 })
    .withMessage('Subheading must be under 200 characters'),
  body('content')
    .optional()
    .customSanitizer(sanitizeRichText)
    .isLength({ min: 0 })
    .withMessage('Content length is limited'),
  ...commonRules
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Blog validation failed',
      errors: errors.array()
    });
  }

  return next();
};

export const validateBlogCreation = [...blogCreateRules, handleValidation];
export const validateBlogUpdate = [...blogUpdateRules, handleValidation];
export const sanitizeHtmlContent = sanitizeRichText;

