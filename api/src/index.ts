import { Elysia } from "elysia";
import api from "./routes"
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(api)  
  .use(cors())

if(process.env.NODE_ENV === 'development') {
  app.use(swagger()).listen(4000)
} else {
  app.listen(4000)
}

export type API = typeof app
  