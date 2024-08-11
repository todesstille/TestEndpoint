import { body } from 'express-validator';
import { adminMiddleware } from '../../../global-middlewares';
import { db } from '../../../app';

export const createPostMiddleware = [
    adminMiddleware,
    body('title').exists().withMessage('title field not exist')
        .isString().withMessage('title is not string')
        .isLength({min: 1, max: 30}).withMessage('title too long'),
    
    body('shortDescription').exists().withMessage('description field not exist')
        .isString().withMessage('description is not string')
        .isLength({min: 1, max: 100}).withMessage('description too long'),

    body('content').exists().withMessage('content field not exist')
        .isString().withMessage('content is not string')
        .isLength({min: 1, max: 1000}).withMessage('content too long'),

    body('blogId').exists().withMessage('blogId field not exist')
        .isString().withMessage('blogId is not string')
        .custom(async (blogId) => {
            const blog = await db.findBlogs(blogId);
            if (blog === undefined) {
              throw new Error('blogId is invalid');
            }
            return true;
          })
]