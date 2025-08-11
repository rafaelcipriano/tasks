import { Router } from "express";
import { TaskLogsController } from "@controllers/task-logs.controller";

const taskLogsRoutes = Router()
const taksLogsController = new TaskLogsController()

taskLogsRoutes.get("/:taskId", taksLogsController.show)

export { taskLogsRoutes }