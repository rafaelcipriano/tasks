import { env } from "../../env"

export const auth = {
  jwt: {
    auth: env.JWT_SECRET,
    expiresIn: "1d"
  }
}