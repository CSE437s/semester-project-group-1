import { Elysia } from "elysia";
import api from "./routes"
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(api)
  .use(swagger())
  .use(cors())
  .listen(4000)

export type API = typeof app
  