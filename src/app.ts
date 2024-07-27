import express from "express";
export const app = express();
import cors from 'cors';

import { SETTINGS } from "./settings";
import { DataBase } from "./db/db";
import { blogsRouter } from "./features/blogs";
import { postsRouter } from "./features/posts";
import { testingRouter } from "./features/testing";

export const db = new DataBase();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({version: '1.0'});
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);