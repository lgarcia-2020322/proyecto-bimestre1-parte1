

import { body, param, query } from "express-validator"
import { validateErrors } from "./validate.error.js"
import { existUsername, existEmail, existUserById, existProductById } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
        validateErrors
]


export const UpdateValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .notEmpty()
        .isEmail(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

export const updatePasswordValidator = [
    body('currentPassword', 'Current password cannot be empty')
        .notEmpty(),
    body('newPassword', 'New password must be at least 8 characters long')
        .notEmpty()
        .isLength({ min: 8 }),
    validateErrors
]

// Validación para actualizar el rol
export const updateRoleValidator = [
    body('role', 'Role must be either ADMIN or CLIENT')
        .isIn(['ADMIN', 'CLIENT']),
    body('id').custom(existUserById), // Verifica si el usuario existe antes de cambiar el rol
    validateErrors
]

export const searchProductValidator = [
    query('name', 'Name query parameter is required')
        .notEmpty(),
    validateErrors
]

export const categoryProductValidator = [
    param('categoryId', 'Category ID is required')
        .notEmpty()
        .isMongoId(),
    validateErrors
]

export const cartValidator = [
    body('productId', 'Product ID is required')
        .notEmpty()
        .isMongoId()
        .custom(existProductById),
    body('quantity', 'Quantity must be at least 1')
        .notEmpty()
        .isInt({ min: 1 }),
    validateErrors
]

export const updateInvoiceValidator = [
    body('status', 'Invalid status')
        .isIn(['PENDING', 'COMPLETED', 'CANCELLED']),
    validateErrors
]

export const removeFromCartValidator = [
    body('productId', 'Product ID is required')
        .notEmpty()
        .isMongoId(),
    validateErrors
]