import { Router } from 'express'

import { login, register } from './auth.controller.js'
import { registerValidator, loginValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'

const api = Router()

// Publicas

api.post(
    '/register',
    [registerValidator, deleteFileOnError],
    register
)

api.post(
    '/login', 
    [
        loginValidator
    ], 
    login
)




// api.get('/test', test)

export default api