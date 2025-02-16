import { Router } from 'express'

import { createCategory, deleteCategory, getAll, update } from './category.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router()

api.post(
    '/Add',
    [
        validateJwt,
        isAdmin
    ],
    createCategory
)

api.get(
    '/getAll',
    [
        validateJwt,
        isAdmin
    ],
    getAll
)

api.put(
    '/update/:id',
    [
        validateJwt,
        isAdmin
    ],
    update
)

api.delete(
    '/delete/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteCategory
)

export default api