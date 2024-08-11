import { MongoClient, Db, Collection, WithId } from 'mongodb';
import { SETTINGS } from '../settings';

export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export type Post = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
}

export class DataBase {
    blogs: Blog[];
    posts: Post[];
    blogsDB: Collection<Blog> | null;
    postsDB: Collection<Post> | null;
    nextId: number;

    constructor() {
        this.blogs = [];
        this.posts = [];
        this.nextId = 1;
        this.blogsDB = null; 
        this.postsDB = null;
    }

    async init(client: MongoClient) {
        const db: Db = client.db(SETTINGS.DB_NAME);

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
            websiteUrl: blog.websiteUrl
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
        let blog: Blog = {
            id: id,
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        };

        const ttt = await this.blogsDB?.updateOne({id: id}, {$set: blog});
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
        }
        this.nextId++;
        this.posts.push(currentPost);
        return currentPost;
    }

    async getPosts() {
        return this.posts;
    }

    async findPosts(id: string): Promise<Post | undefined> {
        let post: Post;
        
        for (post of this.posts) {
            if (post.id === id) {
                return post;
            }
        }
    }

    async modifyPost(id: string, data: any) {
        let post: Post;
        
        for (post of this.posts) {
            if (post.id === id) {
                const parentBlog: any = await this.findBlogs(data.blogId);

                post.title = data.title;
                post.shortDescription = data.shortDescription;
                post.content = data.content;
                post.blogId = data.blogId;
                post.blogName = parentBlog.name;
                return;
            }
        }
    }

    async deletePost(id: string) {
        let post: Post;
        
        for (let i = 0; i < (this.posts).length; i++) {
            post = this.posts[i];
            if (post.id === id) {
                let lastPost: Post = this.posts[this.posts.length - 1];
                this.posts[i] = lastPost;
                this.posts.pop();
                return;
            }
        }
    }

    async clearDB() {
        this.blogs = [];
        await this.blogsDB?.deleteMany({});
        this.posts = [];
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