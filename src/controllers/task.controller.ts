import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TaskController {
  async create(request: Request, response: Response) {
    const requestData = z.object({
      title: z.string().min(6),
      description: z.string().min(12),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      assigned_to: z.number(),
      team_id: z.number()
    })

    const { title, description, priority, assigned_to, team_id } = requestData.parse(request.body)

    const member = await prisma.users.findUnique({ where: { id: assigned_to } })

    if(!member) throw new AppError("Member not found!", 404)

    const team = await prisma.teams.findUnique({ where: { id: team_id } })

    if(!team) throw new AppError("Team not found", 404)

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
        assignedTo: assigned_to,
        teamId: team_id
      }
    })

    return response.status(201).json(task)
  }

  async index(request: Request, response: Response) {
    const tasks = await prisma.tasks.findMany()

    if(!tasks.length) throw new AppError("There is no tasks!", 404)

    return response.status(200).json(tasks)
  }

  async show(request: Request, response: Response) {
    const { task_id } = z.object({ task_id: z.coerce.number() }).parse(request.params)

    const task = await prisma.tasks.findUnique({ where: { id: task_id } })

    if(!task) throw new AppError("Task not found!", 404)
    
    return response.status(200).json(task)
  }

  async updateStatus(request: Request, response: Response) {
    const { task_id } = z.object({ task_id: z.coerce.number() }).parse(request.params)

    const requestData = z.object({
      newStatus: z.enum(["in_progress", "completed"])
    })
    
    const task = await prisma.tasks.findUnique({ where: { id: task_id } })

    if(!task) throw new AppError("Task not found!", 404)

    const { newStatus } = requestData.parse(request.body)
      
    if(task.status === newStatus)
      throw new AppError("The task already has this status!")
      
    const taskUpdated = await prisma.tasks.update({
      data: {
        status: newStatus
      }, where: { id: task_id }
    })

    return response.status(200).json(taskUpdated)
  }

  async delete(request: Request, response: Response) {
    const { task_id } = z.object({ task_id: z.coerce.number() }).parse(request.params)

    const task = await prisma.tasks.findUnique({ where: { id: task_id } })

    if(!task) 
      throw new AppError("Task not found", 404)
    else {
      return response.status(200).json(
        await prisma.tasks.delete({ where: { id: task_id } })
      )
    }

  }
}

export { TaskController }