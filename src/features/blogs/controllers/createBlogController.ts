import {Response, Request} from 'express';
import { db } from '../../../app';
import { validationResult } from 'express-validator';
import { processErrors } from './helpers/processErrors';

export const createBlogController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(processErrors(errors));
        return;
    }
    const newBlog = await db.createBlog(req.body);
    res.status(201).json(newBlog);
}