import { body } from 'express-validator';
import { adminMiddleware } from '../../../global-middlewares';

export const createBlogMiddleware = [
    adminMiddleware,
    body('name').exists().withMessage('name field not exist')
        .isString().withMessage('name is not string')
        .isLength({max: 15}).withMessage('name too long'),
    
    body('description').exists().withMessage('description field not exist')
        .isString().withMessage('description is not string')
        .isLength({max: 500}).withMessage('description too long'),

    body('websiteUrl').exists().withMessage('websiteUrl field not exist')
        .isString().withMessage('websiteUrl is not string')
        .isLength({max: 100}).withMessage('websiteUrl too long')
        .isURL().withMessage("invalid URL")
]