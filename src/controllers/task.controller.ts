import { Request, Response } from "express";
import { AppError } from "@utils/AppError";
import { prisma } from "@database/prisma";
import { z } from "zod";

class TaskController {
  async create(request: Request, response: Response) {
    const requestData = z.object({
      title: z.string().min(6),
      description: z.string().min(12),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      assignedTo: z.number(),
      teamId: z.number()
    })

    const { title, description, priority, assignedTo, teamId } = requestData.parse(request.body)

    const member = await prisma.users.findUnique({ where: { id: assignedTo } })

    if(!member) throw new AppError("Member not found!", 404)

    const team = await prisma.teams.findUnique({ where: { id: teamId } })

    if(!team) throw new AppError("Team not found", 404)

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
        assignedTo,
        teamId
      }
    })

    await prisma.taskLogs.create({
      data: {
        taskId: task.id,
        changedBy: assignedTo,
        oldStatus: task.status,
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
    const { taskId } = z.object({ taskId: z.coerce.number() }).parse(request.params)

    const task = await prisma.tasks.findUnique({ where: { id: taskId } })

    if(!task) throw new AppError("Task not found!", 404)
    
    return response.status(200).json(task)
  }

  async updateStatus(request: Request, response: Response) {
    const requestData = z.object({ newStatus: z.enum(["pending", "in_progress", "completed"]) })
    const { taskId } = z.object({ taskId: z.coerce.number() }).parse(request.params)
    const { memberId } = z.object({ memberId: z.coerce.number() }).parse(request.query)
    const { newStatus } = requestData.parse(request.body)
    const task = await prisma.tasks.findUnique({ where: { id: taskId } })
    const member = await prisma.users.findUnique({ where: { id: memberId } })

    if(!task) 
      throw new AppError("Task not found!", 404)

    if(!member) 
      throw new AppError("User not found", 404)

    if(task.assignedTo !== memberId)
      throw new AppError("Another member cannot update the status of a task that has not been assigned to them.")

    if(task.status === newStatus)
      throw new AppError("The task already has this status!")
    
    const logUpdated = prisma.taskLogs.updateMany({
      data: {
        oldStatus: task.status,
        newStatus
      }, where: { taskId: task.id }
    })

    const taskUpdated = prisma.tasks.update({
      data: {
        status: newStatus
      }, where: { id: taskId }
    })

    const transaction = await prisma.$transaction([logUpdated, taskUpdated])
    return response.status(200).json(transaction)
  }

  async delete(request: Request, response: Response) {
    const { taskId } = z.object({ taskId: z.coerce.number() }).parse(request.params)

    const task = await prisma.tasks.findUnique({ where: { id: taskId } })

    if(!task)
      throw new AppError("Task not found", 404)
    else {
      const deleteLog = prisma.taskLogs.deleteMany({ where: { taskId: task.id } })
      const deleteTask = prisma.tasks.delete({ where: { id: taskId } })

      const transaction = await prisma.$transaction([deleteLog, deleteTask])
      return response.status(200).json(transaction)
    }

  }
}

export { TaskController }