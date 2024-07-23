import request from 'supertest'
import { app } from '../settings'

describe("Api", () => {
    describe("Version", () => {
        it("correct version", async () => {
            await request(app).get('/').expect({version: '1.0'});
        })
    })
})