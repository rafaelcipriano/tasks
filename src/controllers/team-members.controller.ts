import { Request, Response } from "express"
import { prisma } from "@database/prisma"
import { z } from "zod"
import { AppError } from "@utils/AppError"

class TeamMembers {
  async create(request: Request, response: Response) {
    const { teamId } = z.object({ teamId: z.coerce.number() }).parse(request.params)

    const { memberId } = z.object({ memberId: z.coerce.number() }).parse(request.query)

    const checkIfUserExists = await prisma.users.findFirst({ where: { id: memberId } })

    if(!checkIfUserExists) throw new AppError("User not found!", 404)

    const checkIfTeamExists = await prisma.teams.findFirst({ where: { id: teamId } })

    if(!checkIfTeamExists) throw new AppError("Team not found!", 404)

    await prisma.teamMembers.create({
      data: {
        userId: memberId,
        teamId
      }
    })

    return response.status(201).json()
  }

  async show(request: Request, response: Response) {
    const { teamId } = z.object({ teamId: z.coerce.number() }).parse(request.params)

    const team = await prisma.teams.findUnique({ where: { id: teamId } })

    if(!team) throw new AppError("Team not found!")

    const teamMembers = await prisma.teamMembers.findMany({ where: { teamId: team.id } })

    if(!teamMembers.length) throw new AppError("The team there's no members!")

    const members = await prisma.users.findMany({
      where: {
        id: { in: teamMembers.map(member => member.userId) }
      }
    })

    const membersWithoutPassword = members.map(({ password, ...rest}) => rest)

    return response.status(200).json({ team, members: membersWithoutPassword })
  }

  async deleteMember(request: Request, response: Response) {
    const { memberId } = z.object({ memberId: z.coerce.number() }).parse(request.query)

    await prisma.teamMembers.deleteMany({ where: { userId: memberId } })

    return response.status(200).json()
  }

  async deleteTeam(request: Request, response: Response) {
    const { teamId } = z.object({ teamId: z.coerce.number() }).parse(request.params)

    try {
      const team = await prisma.teamMembers.deleteMany({ where: { teamId: teamId } })
      return response.status(200).json(team)
    } catch (error) {
      return error
    }
  }
}

export { TeamMembers }