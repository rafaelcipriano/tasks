import { Router } from "express";
import { userRoutes } from "@/routes/user.routes";
import { sessionRoutes } from "@/routes/session.routes";
import { teamsRoutes } from "@/routes/teams.routes";
import { teamMembersRoutes } from "./team_members.routes";
import { taskRoutes } from "./task.routes";

const routes = Router()

routes.use("/user", userRoutes)
routes.use("/session", sessionRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/team-members", teamMembersRoutes)
routes.use("/tasks", taskRoutes)

export { routes }