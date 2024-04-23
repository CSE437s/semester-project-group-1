import type { NextApiRequest, NextApiResponse } from 'next'

import OpenAI from 'openai'

export interface QueryAsObject {
  departureAirport: string
  destinationFlavorText: string
  departureStartDate: string
  departureEndDate: string
}
const DATE = new Date().toISOString().split('T')[0]
const SYSTEM: string = `You are a helpful assistant designed turn queries into JSON format. Users will be asking for information about booking flights, 
and you will be provided with their natural language query. This may contain multiple components -- primarily it will be a description of 
where the users want to go, either natural language (e.g. "I want to go somewhere warm"), or specific (e.g. "I want to go to Orlando"). 
They may also choose to provide information about where they want to depart from, this may be as a city or an airport IATA code. Finally,
there may be information about the date range they are happy to take the departing flight during.

The JSON has the following keys:
departure_airport: The airport of departure, as an IATA code.
destination_flavor_text: Natural language details about where the user wants to go, to be processed later.
departure_start_date: The first valid date of departure, in the format YYYY-MM-DD.
departure_end_date: The last valid date of departure, in the format YYYY-MM-DD.

Note that today's date is ${DATE}.

If you are not provided with details that would fit to any of these keys, please return that key as an empty string.

Some examples:
Query: "I want to go to Orlando"
JSON: {"departureAirport": "", "destinationFlavorText": "I want to go to Orlando", "departureStartDate": "", "departureEndDate": ""}

Query: "I want to go somewhere warm, with a dry desert climate"
JSON: {"departureAirport": "", "destinationFlavorText": "I want to go somewhere warm, with a dry desert climate", "departureStartDate": "", "departureEndDate": ""}

Query: "I'm leaving from Chicago and I want to go to somewhere cold that is known for skiing"
JSON: {"departureAirport": "ORD", "destinationFlavorText": "I want to go to somewhere cold that is known for skiing", "departureStartDate": "", "departureEndDate": ""}

Query: "I want to leave in the next week from LAX and go to New York"
JSON: {"departureAirport": "LAX", "destinationFlavorText": "I want to go to New York", "departureStartDate": "2024-04-23", "departureEndDate": "2024-04-30"}
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QueryAsObject | Error>
): Promise<void> {
  const query = req.body.query as string
  const openai = new OpenAI()
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: SYSTEM,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    })

    const result = completion.choices[0]?.message.content ?? ''
    if (result === '') {
      throw new Error('No response from the model')
    }

    const resAsObject = JSON.parse(result) as QueryAsObject

    res.status(200).json(resAsObject)
  } catch (e) {
    res.status(500).json(e as Error)
  }
}
