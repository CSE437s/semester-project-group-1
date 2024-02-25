import { Elysia, t } from "elysia";

import { handleRequest } from "../processors/requestProcessor";

const hello = new Elysia()
    .get('/hello', async () => {
        console.log("ping")
        return 'hello hello' //await handleRequest(null))
    }) 

export { hello };