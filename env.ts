import { z } from "zod"

const environment_schema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333)
})

export const env = environment_schema.parse(process.env)