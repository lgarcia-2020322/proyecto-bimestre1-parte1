import { Router } from 'express'

import { 
    getUserInvoices, 
    getInvoiceDetails, 
    completePurchase, 
    updateInvoice,
    cancelInvoice
} from './invoice.controller.js'

import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { updateInvoiceValidator } from '../../helpers/validators.js'

const api = Router()

// Obtener facturas del usuario autenticado
api.get(
    '/user',
    [
        validateJwt
    ],
    getUserInvoices
)

// Obtener detalles de una factura específica
api.get(
    '/:id',
    [
        validateJwt
    ],
    getInvoiceDetails
)

// Completar compra(Generar factura)
api.post(
    '/checkout',
    [
        validateJwt
    ],
    completePurchase
)

// Editar factura (solo admin)
api.put(
    '/update/:id',
    [
        validateJwt,
        isAdmin,
        updateInvoiceValidator
    ],
    updateInvoice
)

api.put(
    '/cancel/:id', 
    [
        validateJwt
    ],
     cancelInvoice
)

export default api
