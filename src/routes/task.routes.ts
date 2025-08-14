import { Router } from "express";
import { TaskController } from "@controllers/task.controller";
import { verifyUserAuthentication } from "@middleware/verifyUserAuthorization";
import { ensureAuthenticated } from "@middleware/ensureAuthenticated";

const taskRoutes = Router()
const taskControllers = new TaskController()

taskRoutes.use(ensureAuthenticated)

taskRoutes.post("/",verifyUserAuthentication(["ADMIN"]), taskControllers.create)
taskRoutes.get("/", verifyUserAuthentication(["ADMIN","MEMBER"]), taskControllers.index)
taskRoutes.get("/:taskId", verifyUserAuthentication(["ADMIN","MEMBER"]),taskControllers.show)
taskRoutes.put("/:taskId", verifyUserAuthentication(["ADMIN", "MEMBER"]), taskControllers.updateStatus)
taskRoutes.delete("/:taskId", verifyUserAuthentication(["ADMIN",]), taskControllers.delete)

export { taskRoutes }