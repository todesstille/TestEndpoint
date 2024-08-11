import { MongoClient, Db, Collection, WithId } from 'mongodb';
import { SETTINGS } from '../settings';

export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export type Post = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export class DataBase {
    blogsDB: Collection<Blog> | null;
    postsDB: Collection<Post> | null;
    nextId: number;

    constructor() {
        this.nextId = 1;
        this.blogsDB = null; 
        this.postsDB = null;
    }

    async init(client: MongoClient) {
        const db: Db = client.db(SETTINGS.DB_NAME);

        await db.collection(SETTINGS.BLOG_COLLECTION_NAME).drop();
        await db.collection(SETTINGS.POST_COLLECTION_NAME).drop();

        this.blogsDB = db.collection<Blog>(SETTINGS.BLOG_COLLECTION_NAME);
        this.postsDB = db.collection<Post>(SETTINGS.POST_COLLECTION_NAME);
 
        try {
            await client.connect()
            console.log('connected to db')
        } catch (e) {
            console.log(e)
            await client.close()
        }
    }

    async createBlog(blog: any) {
        const currentBlog = {
            id: this.nextId.toString(), 
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString(),
        }
        this.nextId++;

        try {
            await this.blogsDB?.insertOne({... currentBlog});
        } catch(err) {
            console.log("Error writing in DB", err);
        }
        return currentBlog;
    }

    async getBlogs() {
        let blogs: WithId<Blog>[] | undefined;
        let returnedBlogs = [];
        try {
            blogs = await this.blogsDB?.find({}).toArray();
        } catch(err) {
            console.log("Error searching in DB", err);
        }

        if (blogs === undefined) {
            return [];
        } else {
            for (let blog of blogs) {
                returnedBlogs.push(this.removeIdFromBlog(blog));
            }
            return returnedBlogs;
        }
    }

    async findBlogs(id: string): Promise<Blog | undefined> {
        
        let blog;
        try {
            blog = await this.blogsDB?.findOne({id: id});
        } catch(err) {
            console.log("Error searching in DB", err);
        }

        if (blog === null || blog === undefined) {
            return undefined
        } else {
            return this.removeIdFromBlog(blog);
        };
    }

    async modifyBlog(id: string, data: any) {
        let blog: any = {
            id: id,
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        };

        await this.blogsDB?.updateOne({id: id}, {$set: blog});
    }

    async deleteBlog(id: string) {
        await this.blogsDB?.deleteOne({id: id});
    }

    async createPost(post: any) {
        const parentBlog: any = await this.findBlogs(post.blogId);

        const currentPost = {
            id: this.nextId.toString(), 
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: parentBlog.name,
            createdAt: new Date().toISOString(),
        }
        try {
            await this.postsDB?.insertOne({... currentPost});
        } catch(err) {
            console.log("Error writing in DB", err);
        }
        return currentPost;
    }

    async getPosts() {
        let posts: WithId<Post>[] | undefined;
        let returnedPosts = [];
        try {
            posts = await this.postsDB?.find({}).toArray();
        } catch(err) {
            console.log("Error searching in DB", err);
        }

        if (posts === undefined) {
            return [];
        } else {
            for (let post of posts) {
                returnedPosts.push(this.removeIdFromPost(post));
            }
            return returnedPosts;
        }
    }

    async findPosts(id: string): Promise<Post | undefined> {
        
        let post;
        try {
            post = await this.postsDB?.findOne({id: id});
        } catch(err) {
            console.log("Error searching in DB", err);
        }

        if (post === null || post === undefined) {
            return undefined
        } else {
            return this.removeIdFromPost(post);
        };
    }

    async modifyPost(id: string, data: any) {
        const blog = await this.findBlogs(data.blogId);
        if (blog === undefined) {
            throw new Error("error finding in db");
        }
        let post: any = {
            id: id,
            title: data.title,
            content: data.content,
            shortDescription: data.shortDescription,
            blogId: data.blogId,
            blogName: blog.name,
        };

        await this.postsDB?.updateOne({id: id}, {$set: post});
    }

    async deletePost(id: string) {
        await this.postsDB?.deleteOne({id: id});
    }

    async clearDB() {
        await this.blogsDB?.deleteMany({});
        await this.postsDB?.deleteMany({});
    }

    removeIdFromBlog(mongoBlog: WithId<Blog>): Blog { 
        const { _id, ...blog } = mongoBlog;
        return blog;
    }

    removeIdFromPost(mongoPost: WithId<Post>): Post { 
        const { _id, ...post } = mongoPost;
        return post;
    }
}