import { clientConfig } from '@/lib/server/config'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(clientConfig)
  } else {
    res.status(204).end()
  }
}
