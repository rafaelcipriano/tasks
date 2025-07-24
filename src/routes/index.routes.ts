import { Router } from "express";
import { userRoutes } from "@/routes/user.routes";
import { sessionRoutes } from "@/routes/session.routes";

const routes = Router()

routes.use("/user", userRoutes)
routes.use("/session", sessionRoutes)

export { routes }