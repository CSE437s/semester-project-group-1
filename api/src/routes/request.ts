import { Elysia, t } from "elysia";

import { handleRequest } from "../processors/requestProcessor";

const request = new Elysia()
    .post('/request', async ({ body }) => await handleRequest(body), {
        body: t.Object({
            origin_airport: t.String({
                minLength: 3,
                maxLength: 3,
                description: 'The departure airport code',
                error: 'Invalid departure airport code'
            }),
            destination_airport: t.String({
                minLength: 3,
                maxLength: 3,
                description: 'The arrival airport code',
                error: 'Invalid arrival airport code'
            }),
            start_date: t.String({
                format: 'date',
                default: '2022-01-01',
                description: 'The departure date',
                error: 'Invalid departure date'
            }),
            end_date: t.String({
                format: 'date',
                default: '2022-01-01',
                description: 'The arrival date',
                error: 'Invalid arrival date'
            })
        })
    })


export { request };