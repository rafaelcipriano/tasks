import { Router } from "express";
import { userRoutes } from "@/routes/user.routes";
import { sessionRoutes } from "@/routes/session.routes";
import { teamsRoutes } from "@/routes/teams.routes";
import { teamMembersRoutes } from "./team_members.routes";

const routes = Router()

routes.use("/user", userRoutes)
routes.use("/session", sessionRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/team-members", teamMembersRoutes)

export { routes }