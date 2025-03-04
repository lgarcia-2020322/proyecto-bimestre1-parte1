import Invoice from './invoice.model.js'
import Cart from '../carrito/cart.model.js'
import Product from '../productos/product.model.js'

// Obtener facturas de un usuario específico
export const getUserInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.uid }).populate('products.product')

        if (invoices.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No invoices found for this user'
            })
        }

        return res.send({
            success: true,
            message: 'User invoices retrieved successfull',
            total: invoices.length,
            invoices
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Obtener detalles de una factura específica
export const getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params
        const invoice = await Invoice.findById(id).populate('products.product')

        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: 'Invoice not found'
            })
        }

        return res.send({
            success: true,
            message: 'Invoice details retrieved successfully',
            invoice
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Completar compra (Generar factura)
export const completePurchase = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.uid }).populate('products.product')

        if (!cart || cart.products.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Cart is empty'
            })
        }

        let total = 0

        for (const item of cart.products) {
            // Verificar si hay stock
            if (item.product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Not enough stock for ${item.product.name}, available: ${item.product.stock}`
                })
            }
            
            total += item.product.price * item.quantity
        }

        for (const item of cart.products) {
            item.product.stock -= item.quantity
            await item.product.save() // Guardar 
        }

        const invoice = new Invoice({
            user: req.user.uid,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total
        })

        await invoice.save()

        // Eliminar el carrito después de la compra
        await Cart.findOneAndDelete({ user: req.user.uid })

        return res.send({
            success: true,
            message: 'Purchase completed successfully',
            invoice
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Editar una factura (solo admin)
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!['PENDING', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid status'
            })
        }

        const invoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true })

        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: 'Invoice not found'
            })
        }

        return res.send({
            success: true,
            message: 'Invoice updated successfully',
            invoice
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

export const cancelInvoice = async (req, res) => {
    try {
        const { id } = req.params

        const invoice = await Invoice.findById(id).populate('products.product')

        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: 'Invoice not found'
            })
        }

        if (invoice.status === 'CANCELLED') {
            return res.status(400).send({
                success: false,
                message: 'Invoice is already cancelled'
            })
        }

        // Devolver stock de los productos
        for (const item of invoice.products) {
            item.product.stock += item.quantity
            await item.product.save()
        }

        // Actualizar estado de la factura
        invoice.status = 'CANCELLED'
        await invoice.save()

        return res.send({
            success: true,
            message: 'Invoice cancelled successfully and stock restored',
            invoice
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}
