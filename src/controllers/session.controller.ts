import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { auth } from "@/config/auth";
import { AppError } from "@/utils/AppError";

class SessionController {
  async create(request: Request, response: Response) {
    const requestData = z.object({
      email: z.email(),
      password: z.string()
    })

    const { email, password } = requestData.parse(request.body)

    const user = await prisma.users.findFirst({ where: { email }})

    if(!user) {
      throw new AppError("User not found", 404)
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched) {
      throw new AppError("Invalid email or password", 401)
    }

    const { secret, expiresIn } = auth.jwt

    const token = sign(
      { role: user.role ?? "MEMBER" }, 
      secret,
      {
        subject: String(user.id),
        expiresIn
      }
    )

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json({token, user: userWithoutPassword})
  }
}

export { SessionController }