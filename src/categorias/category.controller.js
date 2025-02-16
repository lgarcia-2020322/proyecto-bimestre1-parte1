// nueva categoria
import Category from './category.model.js'
import Product from '../productos/product.model.js'

export const createCategory = async (req, res) => {
    const data = req.body
    if (!data.name){
        return res.status(404).send(
            {
                succes: false,
                message: 'name is required'
            }
        )
    }
    try {
        const existingCategory = await Category.findOne({ name: data.name })

        if (existingCategory) {
            return res.status(400).send(
                {
                success: false,
                message: 'Category with this name already exists'
            }
        )
        }
        const category = new Category(data)
        await category.save()
        return res.send(
            {
                succes: true,
                message: `${category.name} Category created`
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

// get all

export const getAll = async (req, res)=>{
    const { limit, skip } = req.query
    try {
        const category = await Category.find()
        .skip(skip)
        .limit(limit)

        if(category.length === 0){
            return res.status(404).send(
                {
                    succes: false,
                    message: 'Category not found'
                }
            )
        }
        return res.send(
            {
                succes: true,
                message: 'Category found: ',
                total: category.length,
                category
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding category',
                err
            }
        )
    }
}

export const update = async (req, res)=>{
    const { id } = req.params
    const data = req.body
    try {
        const updateCategory = await Category.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send(
            {
                succes: false,
                message: 'Category not found, not updated'
            }
        )
        return res.send(
            {
                succes: true, 
                message: 'Category update succsessfully'
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding category',
                err
            }
        )
    }
}

//eliminar 

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la categoría
        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }

        // crear la categoría "Uncategorized"
        let uncategorizedCategory = await Category.findOne({ name: 'Uncategorized' });

        if (!uncategorizedCategory) {
            uncategorizedCategory = new Category({
                name: 'Uncategorized',
                description: 'Default category'
            });
            await uncategorizedCategory.save();
        }

        // Reasignar productosa
        await Product.updateMany(
            { category: id }, 
            { category: uncategorizedCategory._id }
        );

        // Eliminar
        await Category.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: `Category deleted successfully. Products reassigned to 'Uncategorized'.`
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'General error when deleting category',
            err
        });
    }
};
