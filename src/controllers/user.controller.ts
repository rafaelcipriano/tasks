import { Request, Response } from "express";
import { z } from "zod";
import { hash, compare } from "bcrypt"
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

  async index(request: Request, response: Response) {
    const users = await prisma.users.findMany()

    return response.status(200).json(users)
  }

  async update(request: Request, response: Response) {
    const requestData = z.object({
      name: z.string().optional(),
      email: z.email().optional()
    })

    const { id } = z.object({ id: z.coerce.number() }).parse(request.params)

    const { name, email } = requestData.parse(request.body)

    const user = await prisma.users.findFirst({ where: { id } })

    if(!user) {
      throw new AppError("User not found", 404)
    }

    if(email !== user.email) {
      const emailIsAlreadyInUse = await prisma.users.findUnique({ where: { email } })

      if(emailIsAlreadyInUse) throw new AppError("Email is already in use.")
    }

    return response.status(200).json(
      await prisma.users.update({
        data: {
          name,
          email,
        }, where: { id }
      })
    )
  }

  async updatePassword(request: Request, response: Response) {
    const requestData = z.object({
      old_password: z.string(),
      new_password: z.string().min(6)
    })

    const { id } = z.object({ id: z.coerce.number() }).parse(request.params)
    
    const { old_password, new_password } = requestData.parse(request.body)
    
    if(!old_password || !new_password) {
      throw new AppError("The old and new password must be provided.")
    }
    
    const user = await prisma.users.findFirst({ where: { id }})

    if(!user) {
      throw new AppError("User not found", 404)
    }

    const passwordMatched = await compare(old_password, user.password)

    const encryptedPassword = await hash(new_password, 8)

    if(passwordMatched) {
      await prisma.users.update({
        data: {
          password: encryptedPassword
        }, where: { id }
      })
    } else throw new AppError("The password does not match.")
    
    return response.status(200).json({ message: "Password updated successfully."})
  }
}

export { UserController }