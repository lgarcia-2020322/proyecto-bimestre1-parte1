import { Router } from 'express'

import { 
    getCart, 
    addToCart, 
    updateCart, 
    removeFromCart 
} from './cart.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'
import { cartValidator, removeFromCartValidator   } from '../../helpers/validators.js'

const api = Router()

// Obtener carrito del usuario
api.get(
    '/getCart',
    [
        validateJwt
    ],
    getCart
)

// Agregar producto al carrito
api.post(
    '/add',
    [
        validateJwt,
        cartValidator
    ],
    addToCart
)

// Actualiza cantidad de productos en el carrito
api.put(
    '/update',
    [
        validateJwt,
        cartValidator
    ],
    updateCart
)

// Eliminar producto del carrito
api.delete(
    '/remove',
    [
        validateJwt,
        removeFromCartValidator  
    ],
    removeFromCart
)

export default api
