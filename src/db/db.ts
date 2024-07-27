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
    nextId: number;

    constructor() {
        this.blogs = [];
        this.posts = [];
        this.nextId = 1; 
    }

    createBlog(blog: any) {
        const currentBlog = {
            id: this.nextId.toString(), 
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        this.nextId++;
        this.blogs.push(currentBlog);
        return currentBlog;
    }

    getBlogs() {
        return this.blogs;
    }

    findBlogs(id: string): Blog | undefined {
        let blog: Blog;
        
        for (blog of this.blogs) {
            if (blog.id === id) {
                return blog;
            }
        }
    }

    modifyBlog(id: string, data: any) {
        let blog: Blog;
        
        for (blog of this.blogs) {
            if (blog.id === id) {
                blog.name = data.name;
                blog.description = data.description;
                blog.websiteUrl = data.websiteUrl;
                return;
            }
        }
    }

    deleteBlog(id: string) {
        let blog: Blog;
        
        for (let i = 0; i < (this.blogs).length; i++) {
            blog = this.blogs[i];
            if (blog.id === id) {
                let lastBlog: Blog = this.blogs[this.blogs.length - 1];
                this.blogs[i] = lastBlog;
                this.blogs.pop();
                return;
            }
        }
    }

    createPost(post: any) {
        const parentBlog: any = this.findBlogs(post.blogId);

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

    getPosts() {
        return this.posts;
    }

    findPosts(id: string): Post | undefined {
        let post: Post;
        
        for (post of this.posts) {
            if (post.id === id) {
                return post;
            }
        }
    }

    modifyPost(id: string, data: any) {
        let post: Post;
        
        for (post of this.posts) {
            if (post.id === id) {
                const parentBlog: any = this.findBlogs(data.blogId);

                post.title = data.title;
                post.shortDescription = data.shortDescription;
                post.content = data.content;
                post.blogId = data.blogId;
                post.blogName = parentBlog.name;
                return;
            }
        }
    }

    deletePost(id: string) {
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

    clearDB() {
        this.blogs = [];
        this.posts = [];
    }
}