// autenticacion

import User from '../user/user.model.js';
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'


export const register = async (req, res)=>{
    try {
        let data = req.body
        let user = new User(data)

        user.password = await encrypt(user.password)
        user.role = 'CLIENT'
        await user.save()
        return res.send(
            {
                succes: true,
                message: `Registred succsesfully | can be logged with username: ${user.username}`
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error with registering user', 
                err
            }
        )
    }
}

export const login = async(req,res)=>{
    try {
        let { userLoggin, password } = req.body
        let user = await User.findOne(
            {
                $or: [ 
                    {email: userLoggin},
                    {username: userLoggin}
                ]
            }
        ) 
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    succes: true,
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error with registering user', 
                err
            }
        )
    }
}