const Joi = require('joi');


const registerSchema = Joi.object({
    first_name: Joi.string().min(2).required().messages({
        'string.base': '"first_name" harus berupa teks',
        'string.min': '"first_name" minimal 2 karakter',
        'any.required': '"first_name" wajib diisi'
    }),
    last_name: Joi.string().min(2).required().messages({
        'string.base': '"last_name" harus berupa teks',
        'string.min': '"last_name" minimal 2 karakter',
        'any.required': '"last_name" wajib diisi'
    }),
    email: Joi.string().email().required().messages({
        'string.base': '"email" harus berupa teks',
        'string.email': '"email" harus memiliki format yang valid',
        'any.required': '"email" wajib diisi'
    }),
    password: Joi.string().min(8).required().messages({
        'string.base': '"password" harus berupa teks',
        'string.min': '"password" minimal 6 karakter',
        'any.required': '"password" wajib diisi'
    }),
    balance: Joi.number().min(0).default(0).messages({
        'number.base': '"balance" harus berupa angka',
        'number.min': '"balance" minimal 0'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email harus berupa teks',
      'string.email': 'Email tidak sesuai format',
      'any.required': 'Email wajib diisi'
    }),
    password: Joi.string().min(8).required().messages({
      'string.base': 'Password harus berupa teks',
      'string.min': 'Password minimal 6 karakter',
      'any.required': 'Password wajib diisi'
    })
  });

  const updateProfileSchema = Joi.object({
    first_name: Joi.string().min(2).optional(),
    last_name: Joi.string().min(2).optional()
});

const updateAvatarSchema = Joi.object({
    first_name: Joi.string().min(2).max(50).optional().messages({
        'string.base': '"first_name" harus berupa teks',
        'string.min': '"first_name" minimal 2 karakter',
        'string.max': '"first_name" maksimal 50 karakter'
    }),
    last_name: Joi.string().min(2).max(50).optional().messages({
        'string.base': '"last_name" harus berupa teks',
        'string.min': '"last_name" minimal 2 karakter',
        'string.max': '"last_name" maksimal 50 karakter'
    })
});
  

module.exports = { registerSchema, loginSchema, updateProfileSchema, updateAvatarSchema };
