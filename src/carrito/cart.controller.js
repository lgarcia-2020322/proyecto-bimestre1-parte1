import Cart from './cart.model.js'
import Product from '../productos/product.model.js'

// Obtener carrito del usuario
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.uid }).populate('products.product')

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            })
        }

        return res.send({
            success: true,
            message: 'Cart retrieved successfully',
            cart
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

// Agregar productos al carrito
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }

        if (product.stock < quantity) {
            return res.status(400).send({
                success: false,
                message: 'Not enough stock available'
            })
        }

        let cart = await Cart.findOne({ user: req.user.uid })

        if (!cart) {
            cart = new Cart({ user: req.user.uid, products: [] })
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId)

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity
        } else {
            cart.products.push({ product: productId, quantity })
        }

        await cart.save()

        return res.send({
            success: true,
            message: 'Product added to cart successfully',
            cart
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

// Actualizar cantidad de productos en el carrito
export const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const cart = await Cart.findOne({ user: req.user.uid })

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            })
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId)

        if (productIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Product not found in cart'
            })
        }

        if (quantity <= 0) {
            cart.products.splice(productIndex, 1)
        } else {
            cart.products[productIndex].quantity = quantity
        }

        await cart.save()

        return res.send({
            success: true,
            message: 'Cart updated successfully',
            cart
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

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body
        const cart = await Cart.findOne({ user: req.user.uid })

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            })
        }

        cart.products = cart.products.filter(item => item.product.toString() !== productId)
        await cart.save()

        return res.send({
            success: true,
            message: 'Product removed from cart successfully'
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
