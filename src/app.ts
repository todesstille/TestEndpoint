import express from "express";
export const app = express();
import cors from 'cors';
import {Response, Request, NextFunction} from 'express';

import { SETTINGS } from "./settings";
import { DataBase } from "./db/db";
import { blogsRouter } from "./features/blogs";
import { postsRouter } from "./features/posts";
import { testingRouter } from "./features/testing";

export const db = new DataBase();

function trimmer(req: Request, res: Response, next: NextFunction) {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof(value) === 'string')
            req.body[key] = value.trim();
    }
    next();
}

app.use(express.json());
app.use(cors());
app.use(trimmer);

app.get("/", (req, res) => {
    res.status(200).json({version: '4.0'});
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);