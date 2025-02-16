import { Schema, model } from 'mongoose'

const categorySchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'name is required'],
            maxLength: [20, `can't be overcome 20 characters`]
        },
        description: {
            type: String,
            required: [false, 'description in not required'],
            maxLength: [40, `can't be overcome 20 characters`]
        }
    },{
        versionKey: false,
        timestamps: true 
    }
)

export default model('Category', categorySchema)