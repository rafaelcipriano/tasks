import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcrypt"
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UserController {
  async create(request: Request, response: Response) {
    const requestData = z.object({
      name: z.string().trim().min(3),
      email: z.email(),
      password: z.string().min(6)
    }).catchall(z.string())

    const { name, email, password } = requestData.parse(request.body)

    const encryptedPassword = await hash(password, 8)

    const emailIsAlreadyInUse = await prisma.users.findFirst({ where: { email } })

    if(emailIsAlreadyInUse)
      throw new AppError("Email is already in use.")

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: encryptedPassword
      }
    })

    const { password: _, ...userDataWithoutPassword } = user

    return response.status(201).json(userDataWithoutPassword)
  }
}

export { UserController }