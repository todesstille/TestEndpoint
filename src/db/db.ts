export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  }

export class DataBase {
    blogs: Blog[];
    posts: any[];
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
}