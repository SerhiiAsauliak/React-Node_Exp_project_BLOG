import {body} from 'express-validator'

export const regValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Min length 4 symbols').isLength({min: 4}),
    body('firstName', 'Enter name. Min length 2 symbols').isLength({min:2}),
    body('avatarUrl', 'Invalid link').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Min length 4 symbols').isLength({min: 4}),
]

export const postCreateValidation = [
    body('title', 'Enter post title').isLength({min: 3}),
    body('text', 'Enter post text. Min length 4 symbols').isLength({min: 4}),
    body('tags', 'Invalid tag format').optional().isString(),
    body('imageUrl', 'Invalid image link').optional().isURL(),
]