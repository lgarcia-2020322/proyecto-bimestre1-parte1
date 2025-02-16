import { Router } from "express";
import { getAll, getProfile } from './user.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';
import { UpdateValidator } from "../../helpers/validators.js";


const api = Router()

// rutas
api.get(
    '/all',
    [
        validateJwt,
        isAdmin
    ],
    getAll
)

api.get(
    '/:id', 
    [
        validateJwt
    ],
    getProfile
)

api.put(
    '/adminUpdate/:id',
    [
        validateJwt,
        UpdateValidator,
        isAdmin
    ]
)

export default api