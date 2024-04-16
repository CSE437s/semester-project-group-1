import type { NextApiRequest, NextApiResponse } from 'next'

import { type CreateEmbeddingResponse } from 'openai/resources/embeddings.mjs'
import OpenAI from 'openai'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateEmbeddingResponse | Error>
) {
  const query = req.body.query as string
  const openai = new OpenAI()
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      encoding_format: 'float',
    })
    res.status(200).json(embedding)
  } catch (e) {
    res.status(500).json(e as Error)
  }
}
