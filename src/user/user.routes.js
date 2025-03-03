import { Router } from 'express'

import { 
    getAll, 
    getProfile, 
    updateProfile, 
    updatePassword, 
    updateRole, 
    deleteAccount 
} from './user.controller.js'

import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { UpdateValidator } from '../../helpers/validators.js'

const api = Router()

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
    '/update/:id',
    [
        validateJwt,
        UpdateValidator
    ],
    updateProfile
)


api.put(
    '/updatePassword/:id',
    [
        validateJwt
    ],
    updatePassword
)

api.put(
    '/updateRole/:id',
    [
        validateJwt,
        isAdmin
    ],
    updateRole
)

api.delete(
    '/delete/:id',
    [
        validateJwt
    ],
    deleteAccount
)

export default api
