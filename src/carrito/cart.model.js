import { Schema, model } from 'mongoose'

const cartSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity cannot be less tha 1']
                }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('Cart', cartSchema)
