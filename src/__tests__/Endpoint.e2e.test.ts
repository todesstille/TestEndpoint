import request from 'supertest'
import { app, db } from '../app'
import {fromUTF8ToBase64} from '../global-middlewares'
import {SETTINGS} from '../settings'
import {MongoMemoryServer} from "mongodb-memory-server";
import { MongoClient } from 'mongodb';

let mongoServer: any;
let mongoClient: any;

const auth = {'Authorization': 'Basic ' + fromUTF8ToBase64(SETTINGS.ADMIN)}

const getDefaultBlog = () => {
    return {
        name: "my blog",
        description: "basic description",
        websiteUrl: "http://test.com"
    }
}

const getDefaultPost = () => {
    return {
        title: "my post",
        shortDescription: "post description",
        content: "Hello guys! This is my first post!",
        blogId: '2'
    }
}

const getStringWithLength = (l: number): string => {
    let s = "";
    for (let i = 0; i < l; i++) {
        s += "a";
    }
    return s;
}

describe("Api", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        await db.init(mongoClient);
    });

    afterAll(async () => {
        if (mongoClient) {
            await mongoClient.close();
        }

        if (mongoServer) {
            await mongoServer.stop();
        }

    }, 15000);

    describe("Version", () => {
        it("correct version", async () => {
            await request(app).get('/').expect({version: '4.0'});
        })
    })

    describe("Blogs", () => {
        it("must auth to post", async () => {
            const res = await request(app)
                .post('/blogs')
                .send({})
                .expect(401);
        })
        it("all errors on empty object", async () => {
            const res = await request(app)
                .post('/blogs')
                .set(auth)
                .send({})
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: "error!",
                        field: "name"
                    },
                    {
                        message: "error!",
                        field: "description"
                    },
                    {
                        message: "error!",
                        field: "websiteUrl"
                    }
                ]
            })
        })

        it("error on incorrect name", async () => {
            const blog: any = getDefaultBlog();
            delete blog.name;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "name"
                    }
                ]
            }

            let res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.name = 13;

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.name = getStringWithLength(16);

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.name = "      ";

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("error on incorrect description", async () => {
            const blog: any = getDefaultBlog();
            delete blog.description;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "description"
                    }
                ]
            }

            let res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.description = 13;

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.bigDescription = getStringWithLength(500);

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("error on incorrect url", async () => {
            const blog: any = getDefaultBlog();
            delete blog.websiteUrl;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "websiteUrl"
                    }
                ]
            }

            let res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.websiteUrl = 13;

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.websiteUrl = "http://" + getStringWithLength(500) + ".com";

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            blog.websiteUrl = "test";

            res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("parces correct request", async () => {
            const blog: any = getDefaultBlog();
            const correctResponce: any = getDefaultBlog();
            correctResponce.id = "1";
            correctResponce.isMembership = false;

            const res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(201);

            correctResponce.createdAt = res.body.createdAt;

            expect(res.body).toEqual(correctResponce);
        });

        it("could get list of blogs", async () => {
            const correctResponce: any = getDefaultBlog();
            correctResponce.id = "1";
            correctResponce.isMembership = false;

            const res = await request(app)
            .get('/blogs')
            .expect(200);

            correctResponce.createdAt = res.body[0].createdAt;

            expect(res.body).toEqual([correctResponce]);
        });

        it("could find blog", async () => {
            const correctResponce: any = getDefaultBlog();
            correctResponce.id = "1";
            correctResponce.isMembership = false;

            const res = await request(app)
            .get('/blogs/1')
            .expect(200);

            correctResponce.createdAt = res.body.createdAt;

            expect(res.body).toEqual(correctResponce);

            await request(app)
            .get('/blogs/2')
            .expect(404);
        });

        it("must auth to modify", async () => {
            await request(app)
                .put('/blogs/1')
                .send({})
                .expect(401);            
        })

        it("can't modify if incorrect id", async () => {
            const blog = getDefaultBlog();

            await request(app)
            .put('/blogs/2')
            .set(auth)
            .send(blog)
            .expect(404);
        });

        it("can't modify if incorrect data", async () => {
            const res = await request(app)
            .put('/blogs/1')
            .set(auth)
            .send({})
            .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: "error!",
                        field: "name"
                    },
                    {
                        message: "error!",
                        field: "description"
                    },
                    {
                        message: "error!",
                        field: "websiteUrl"
                    }
                ]
            })
        });

        it("could modify", async () => {
            const blog: any = getDefaultBlog();
            blog.name = "my new blog"

            await request(app)
            .put('/blogs/1')
            .set(auth)
            .send(blog)
            .expect(204);

            let res = await request(app).get('/blogs/1');
            blog.id = '1';
            blog.createdAt = res.body.createdAt;
            blog.isMembership = false;
            expect(res.body).toEqual(blog);
        });

        it("must auth to delete", async () => {
            await request(app)
                .delete('/blogs/1')
                .send({})
                .expect(401);
        })

        it("can't delete if incorrect id", async () => {
            const blog = getDefaultBlog();

            await request(app)
            .delete('/blogs/2')
            .set(auth)
            .send({})
            .expect(404);
        });

        it("could delete", async () => {
            const blog: any = getDefaultBlog();

            await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(201);

            let res = await request(app)
            .get('/blogs')
            .send({})
            .expect(200)

            expect((res.body).length).toEqual(2);

            await request(app)
            .delete('/blogs/1')
            .set(auth)
            .send({})
            .expect(204);

            blog.id = '2';

            res = await request(app)
            .get('/blogs')
            .send({})
            .expect(200)

            blog.createdAt = res.body[0].createdAt;
            blog.isMembership = false;

            expect(res.body).toEqual([blog]);

        });
    });

    describe("Posts", () => {
        it("must auth to post", async () => {
            const res = await request(app)
                .post('/posts')
                .send({})
                .expect(401);            
        });

        it("all errors on empty object", async () => {
            const res = await request(app)
                .post('/posts')
                .set(auth)
                .send({})
                .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: "error!",
                        field: "title"
                    },
                    {
                        message: "error!",
                        field: "shortDescription"
                    },
                    {
                        message: "error!",
                        field: "content"
                    },
                    {
                        message: "error!",
                        field: "blogId"
                    }
                ]
            })
        });

        it("error on incorrect title", async () => {
            const post: any = getDefaultPost();
            delete post.title;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "title"
                    }
                ]
            }

            let res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.name = 13;

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.name = getStringWithLength(31);

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("error on incorrect shortDescription", async () => {
            const post: any = getDefaultPost();
            delete post.shortDescription;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "shortDescription"
                    }
                ]
            }

            let res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.shortDescription = 13;

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.shortDescription = getStringWithLength(101);

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("error on incorrect content", async () => {
            const post: any = getDefaultPost();
            delete post.content;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "content"
                    }
                ]
            }

            let res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.content = 13;

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.content = getStringWithLength(1001);

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("error on incorrect blogId", async () => {
            const post: any = getDefaultPost();
            delete post.blogId;

            const errorMessage = {
                errorsMessages: [
                    {
                        message: "error!",
                        field: "blogId"
                    }
                ]
            }

            let res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.blogId = 13;

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);

            post.blogId = '1';

            res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual(errorMessage);
        });

        it("parces correct request", async () => {
            const post: any = getDefaultPost();
            const correctResponce: any = getDefaultPost();
            correctResponce.id = "3";
            correctResponce.blogName = "my blog";

            const res = await request(app)
            .post('/posts')
            .set(auth)
            .send(post)
            .expect(201);

            correctResponce.createdAt = res.body.createdAt;

            expect(res.body).toEqual(correctResponce);
        });

        it("could get list of posts", async () => {
            const correctResponce: any = getDefaultPost();
            correctResponce.id = "3";
            correctResponce.blogName = "my blog";

            const res = await request(app)
            .get('/posts')
            .expect(200);

            correctResponce.createdAt = res.body[0].createdAt;

            expect(res.body).toEqual([correctResponce]);
        });

        it("could find post", async () => {
            const correctResponce: any = getDefaultPost();
            correctResponce.id = "3";
            correctResponce.blogName = "my blog";

            const res = await request(app)
            .get('/posts/3')
            .expect(200);

            correctResponce.createdAt = res.body.createdAt;

            expect(res.body).toEqual(correctResponce);

            await request(app)
            .get('/posts/4')
            .expect(404);
        });

        it("must auth to modify post", async () => {
            await request(app)
                .put('/posts/3')
                .send({})
                .expect(401);            
        });

        it("can't modify post if incorrect id", async () => {
            const post = getDefaultPost();

            await request(app)
            .put('/posts/4')
            .set(auth)
            .send(post)
            .expect(404);
        });

        it("can't modify post if incorrect data", async () => {
            const res = await request(app)
            .put('/posts/3')
            .set(auth)
            .send({})
            .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: "error!",
                        field: "title"
                    },
                    {
                        message: "error!",
                        field: "shortDescription"
                    },
                    {
                        message: "error!",
                        field: "content"
                    },
                    {
                        message: "error!",
                        field: "blogId"
                    }
                ]
            })
        });

        it("can't modify post if incorrect blogId", async () => {
            const post = getDefaultPost();
            post.blogId = '4';

            const res = await request(app)
            .put('/posts/3')
            .set(auth)
            .send(post)
            .expect(400);

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        message: "error!",
                        field: "blogId"
                    }
                ]
            })
        });

        it("could modify post", async () => {
            const blog: any = getDefaultBlog();
            blog.name = "one more blog";

            const t = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(201);

            const post: any = getDefaultPost();
            post.blogId = '3';

            await request(app)
            .put('/posts/3')
            .set(auth)
            .send(post)
            .expect(204);

            let res = await request(app).get('/posts/3');
            post.id = '3';
            post.blogName = "one more blog";
            post.createdAt = res.body.createdAt;
            expect(res.body).toEqual(post);
        });

        it("could delete", async () => {

            await request(app)
            .delete('/posts/3')
            .set(auth)
            .send({})
            .expect(204);

            const res = await request(app)
            .get('/posts')
            .send({})
            .expect(200)

            expect(res.body).toEqual([]);

        });
    });

    describe("Testing", () => {
        it("clears database", async () => {
            await request(app).delete('/testing/all-data').expect(204);

            let res = await request(app)
            .get('/posts')
            .send({})
            .expect(200)

            expect(res.body).toEqual([]);

            res = await request(app)
            .get('/blogs')
            .send({})
            .expect(200)

            expect(res.body).toEqual([]);
        })
    })
})