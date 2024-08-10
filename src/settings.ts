import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    PORT: process.env.PORT || 8080,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL: "mongodb://localhost:27017",
    DB_NAME: "blog_platform_db",
    BLOG_COLLECTION_NAME: "blogs_collection",
    POST_COLLECTION_NAME: "posts_collection",
}