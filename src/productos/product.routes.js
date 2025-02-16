import { Router } from "express";

import { 
    createProduct, 
    getAllProducts, 
    getOneProduct, 
    updateProduct, 
    StockProducts, 
    deleteProduct,
    getBestProducts,
    ProductsByName,
    getProductsByCategory

} from "./product.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";

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
);

api.get(
    '/One/:id',
    [
        validateJwt
    ],
    getOneProduct
);

api.put(
    '/Update/:id',
    [
        validateJwt,
        isAdmin
    ],
    updateProduct
);

api.get(
    '/OutOfStock',
    [
        validateJwt
    ],
    StockProducts
);

api.delete(
    '/Delete/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteProduct
);
// buscar los mejores
api.get(
    '/Best',
    [
        validateJwt
    ],
    getBestProducts
);

// Buscar productos por nombre 
api.get(
    '/Search',
    [
        validateJwt
    ],
    ProductsByName
);

// productos por categoría
api.get(
    '/Category/:categoryId',
    [
        validateJwt
    ],
    getProductsByCategory
);

export default api