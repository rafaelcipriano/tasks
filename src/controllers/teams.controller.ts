import { Request, Response } from "express";
import { prisma } from "@database/prisma";
import { z } from "zod";

class TeamsController {
  async create(request: Request, response: Response) {
    const requestData = z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty()
    })

    const { name, description } = requestData.parse(request.body)

    const team = await prisma.teams.create({
      data: {
        name,
        description
      }
    })

    return response.status(201).json(team)
  }

  async index(request: Request, response: Response) {
    return response.status(200).json(
      await prisma.teams.findMany()
    )
  }

  async update(request: Request, response: Response) {
    const requestData = z.object({
      name: z.string().nonempty().optional(),
      description: z.string().nonempty().optional()
    })

    const { teamId } = z.object({ teamId: z.coerce.number() }).parse(request.params)

    const { name, description } = requestData.parse(request.body)

    const team = await prisma.teams.update({
      data: {
        name,
        description
      }, where: { id: teamId }
    })


    return response.status(200).json(team)
  }

  async delete(request: Request, response: Response) {
    const { teamId } = z.object({ teamId: z.coerce.number() }).parse(request.params)

    return response.status(200).json(
      await prisma.teams.delete({ where: { id: teamId } })
    )
  }
}

export { TeamsController }