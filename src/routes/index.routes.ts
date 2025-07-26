import { Router } from "express";
import { userRoutes } from "@/routes/user.routes";
import { sessionRoutes } from "@/routes/session.routes";
import { teamsRoutes } from "@/routes/teams.routes";

const routes = Router()

routes.use("/user", userRoutes)
routes.use("/session", sessionRoutes)
routes.use("/teams", teamsRoutes)

export { routes }