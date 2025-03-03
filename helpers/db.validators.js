
import Product from '../src/productos/product.model.js'
import User from '../src/user/user.model.js'


export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmail = async(email)=>{
    const alreadyEmail = await User.findOne({email}) 
        if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}

export const existUserById = async (id) => {
    try {
        const userExist = await User.findById(id)
        if (!userExist) {
            console.error(`User with ID ${id} does not exist`)
            throw new Error(`User with ID ${id} does not exist`)
        }
    } catch (err) {
        console.error(err)
        throw new Error('Invalid user ID')
    }
}

export const hasInvoices = async (id) => {
    const invoice = await Invoice.findOne({ user: id })
    if (invoice) {
        throw new Error(`User with ID ${id} has purchase history and cannot be deleted`)
    }
}

export const existProductById = async (id) => {
    const productExist = await Product.findById(id)
    if (!productExist) {
        console.error(`Product with ID ${id} does not exist`)
        throw new Error(`Product with ID ${id} does not exist`)
    }
}