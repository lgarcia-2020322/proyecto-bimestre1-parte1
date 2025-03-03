import { Schema, model } from 'mongoose';

const productSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            maxLength: [50, `can't exceed 50 characters`]
        },
        description: {
            type: String,
            required: false,
            maxLength: [200, `can't exceed 200 characters`]
        },
        price: {
            type: Number,
            required: [true, 'price is required'],
            min: [0, 'price cannot be negative']
        },
        stock: {
            type: Number,
            required: [true, 'stock is required'],
            min: [0, 'stock cannot be negative']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'category is requird']
        },
        status: {
            type: Boolean, 
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default model('Product', productSchema);
