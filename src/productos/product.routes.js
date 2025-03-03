import { Router } from 'express'

import { 
    createProduct, 
    getAllProducts, 
    getOneProduct, 
    updateProduct, 
    deleteProduct,
    searchProductsByName,
    getBestSellingProducts,
    getProductsByCategory
} from './product.controller.js'

import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post(
    '/Add',
    [
        validateJwt,
        isAdmin
    ],
    createProduct
)

api.get(
    '/All',
    [
        validateJwt
    ],
    getAllProducts
)

api.get(
    '/One/:id',
    [
        validateJwt
    ],
    getOneProduct
)

api.put(
    '/Update/:id',
    [
        validateJwt,
        isAdmin
    ],
    updateProduct
)

api.delete(
    '/Delete/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteProduct
)

// Buscar productos por nombr
api.get(
    '/Search',
    [
        validateJwt
    ],
    searchProductsByName
)

// Obtener los productos más vendidos
api.get(
    '/BestSelling',
    [
        validateJwt
    ],
    getBestSellingProducts
)

// Obtener productos por categoría
api.get(
    '/Category/:categoryId',
    [
        validateJwt
    ],
    getProductsByCategory
)

export default api
