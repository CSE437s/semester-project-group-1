import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { hello } from "./hello";
import { request } from "./request";

const apiApp = new Elysia({ prefix: '/api' })
    .use(hello)
    .use(request)
    .use(cors())

export default apiApp;
export type API = typeof apiApp;