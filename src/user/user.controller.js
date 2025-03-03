import User from './user.model.js'
import Invoice from '../facturas/invoice.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'

// Obtener todos los usuarios (admin)
export const getAll = async (req, res) => {
    const { limit = 20, skip = 0 } = req.query
    try {
        const users = await User.find().skip(skip).limit(limit)

        if (users.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Users not found'
            })
        }

        return res.send({
            success: true,
            message: 'Users found',
            total: users.length,
            users
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

// Obtener perfil de usuario
export const getProfile = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User found',
            user
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

// Actualizar perfil (admin puede actualizar cualquier usuario, cliente solo su propio perfil)
export const updateProfile = async (req, res) => {
    const { id } = req.params
    const { role, password, ...updateData } = req.body

    try {
        if (req.user.role !== 'ADMIN' && req.user.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'You can only update your own profile'
            })
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User updated successfully',
            user
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

// Actualizar contraseña
export const updatePassword = async (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    try {
        if (req.user.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'You can only update your own password'
            })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await checkPassword(user.password, currentPassword)
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        user.password = await encrypt(newPassword)
        await user.save()

        return res.send({
            success: true,
            message: 'Password updated successfully'
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

// Actualizar rol (solo admin puede cambiar roles)
export const updateRole = async (req, res) => {
    const { id } = req.params
    const { role } = req.body

    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).send({
                success: false,
                message: 'Only admins can change roles'
            })
        }

        if (role !== 'ADMIN' && role !== 'CLIENT') {
            return res.status(400).send({
                success: false,
                message: 'Invalid role'
            })
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'Role updated successfully',
            user
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

export const deleteAccount = async (req, res) => {
    const { id } = req.params

    try {
        if (req.user.uid !== id && req.user.role !== 'ADMIN') {
            return res.status(403).send({
                success: false,
                message: 'You can only delete your own account'
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        if (user.role === 'ADMIN' && req.user.role !== 'SUPERADMIN') {
            return res.status(403).send({
                success: false,
                message: 'You cannot delete an admin account'
            })
        }

        const hasInvoices = await Invoice.findOne({ user: id })

        if (hasInvoices) {
            return res.status(400).send({
                success: false,
                message: 'You cannot delete your account because you have purchase history'
            })
        }

        await User.findByIdAndDelete(id)

        return res.send({
            success: true,
            message: 'User deleted successfully'
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