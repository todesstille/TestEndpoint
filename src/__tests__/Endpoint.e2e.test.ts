import request from 'supertest'
import { app } from '../app'
import {fromUTF8ToBase64} from '../global-middlewares'
import {SETTINGS} from '../settings'

const auth = {'Authorization': 'Basic ' + fromUTF8ToBase64(SETTINGS.ADMIN)}

const getDefaultBlog = () => {
    return {
        name: "my blog",
        description: "basic description",
        websiteUrl: "http://test.com"
    }
}

describe("Api", () => {
    describe("Version", () => {
        it("correct version", async () => {
            await request(app).get('/').expect({version: '1.0'});
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

            blog.name = "aaaaaaaaaaaaaaaa";

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

            let bigDescription = "";
            for (let i = 0; i < 500; i++) {
                bigDescription += "a";
            }
            blog.bigDescription = bigDescription;

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

            let bigDescription = "http://";
            for (let i = 0; i < 500; i++) {
                bigDescription += "a";
            }
            bigDescription += ".com"
            blog.websiteUrl = bigDescription;

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

            const res = await request(app)
            .post('/blogs')
            .set(auth)
            .send(blog)
            .expect(201);

            expect(res.body).toEqual(correctResponce);
        });

        it("could get list of blogs", async () => {
            const correctResponce: any = getDefaultBlog();
            correctResponce.id = "1";

            const res = await request(app)
            .get('/blogs')
            .expect(200);

            expect(res.body).toEqual([correctResponce]);
        });

        it("could find blog", async () => {
            const correctResponce: any = getDefaultBlog();
            correctResponce.id = "1";

            const res = await request(app)
            .get('/blogs/1')
            .expect(200);

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

            expect(res.body).toEqual([blog]);

        });
    })
})