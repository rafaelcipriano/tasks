import { Request, Response } from "express"
import { prisma } from "@database/prisma"
import { z } from "zod"
import { AppError } from "@utils/AppError"

class TaskLogsController {
  async show(request: Request, response: Response) {
    const { taskId } = z.object({ taskId: z.coerce.number() }).parse(request.params)

    const task = await prisma.tasks.findUnique({ where: { id: taskId } })

    if(!task) throw new AppError("Task not found", 404)

    const log = await prisma.taskHistory.findFirst({ where: { taskId } })

    return response.status(200).json(log)
  }
}

export { TaskLogsController }