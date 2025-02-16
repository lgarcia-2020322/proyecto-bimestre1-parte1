import Product from './product.model.js'
import Category from '../categorias/category.model.js'
// agregar


export const createProduct = async (req, res) =>{
    const data = req.body
    if(!data.name){
        return res.status(404).send(
            {
                succses: false,
                message: 'name is required'
            }
        )
    }
    try {
        const existProduct = await Product.findOne({name: data.name})
        const existCategory = await Category.findById(data.category)

        if (!existCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category does not exist'
            });
        }

        if(existProduct){
            return res.status(404).send(
                {
                    succses: false,
                    message: 'Product whit this name alredy exists'
                }
            )
        }
        const product = new Product(data)
        await product.save()
        return res.send(
            {
                succses: true,
                message: `${product.name} Product created`
            }
        )
        
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error', 
                err
            }
        )
    }
}

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        return res.send({
            success: true,
            products
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

// Obtener un producto por ID
export const getOneProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        return res.send({
            success: true,
            product
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

// Editar detalles específicos de un producto
export const updateProduct = async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
        if (!updatedProduct) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        return res.send({
            success: true,
            message: `${updatedProduct.name} updated successfully`,
            updatedProduct
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

// Control de inventario (productos agotados)
export const StockProducts = async (req, res) => {
    try {
        const StockProducts = await Product.find({ stock: 0 })
        return res.send({
            success: true,
            StockProducts
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

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }

        product.status = false  
        await product.save()  

        return res.send({
            success: true,
            message: `${product.name} has been disabled`
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send(
        {
            success: false,
            message: 'General error',
            err
        }
    )
    }
}


// clientes

export const getBestProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ sales: -1 }).limit(10)
        return res.send({
            success: true,
            products
        }
    )
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

export const ProductsByName = async (req, res) => {
        try {
            const { name } = req.query; // Obtiene el nombre desde query params
    
            if (!name) {
                return res.status(400).send({
                    success: false,
                    message: "Name is required"
                });
            }
    
            const products = await Product.find(
                { 
                name: { $regex: `^${name}`, $options: "i",},
                status: true,  // si no esta eliminado el producto no lo muestra 
            }
        ) //validacion para que busque por el nombre exacto
    
            return res.send({
                success: true,
                products
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "General error",
                err
            });
        }
    };

    export const getProductsByCategory = async (req, res) => {
        try {
            const products = await Product.find({ category: req.params.categoryId })
            return res.send({
                success: true,
                products
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