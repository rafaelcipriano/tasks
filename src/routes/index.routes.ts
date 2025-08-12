import { Router } from "express";
import { userRoutes } from "@routes/user.routes";
import { sessionRoutes } from "@routes/session.routes";
import { teamsRoutes } from "@routes/teams.routes";
import { teamMembersRoutes } from "@routes/team-members.routes";
import { taskRoutes } from "@routes/task.routes";
import { taskLogsRoutes } from "@routes/task-logs.routes";

const routes = Router()

routes.use("/user", userRoutes)
routes.use("/session", sessionRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/team-members", teamMembersRoutes)
routes.use("/tasks", taskRoutes)
routes.use("/task-logs", taskLogsRoutes)

export { routes }