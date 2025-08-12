import { Router } from "express";
import { TeamsController } from "@controllers/teams.controller";

import { ensureAuthenticated } from "@middleware/ensureAuthenticated";
import { verifyUserAuthentication } from "@middleware/verifyUserAuthorization";

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.use(ensureAuthenticated, verifyUserAuthentication(["ADMIN"]))
teamsRoutes.post("/", teamsController.create)
teamsRoutes.get("/", teamsController.index)
teamsRoutes.patch("/:id", teamsController.update)
teamsRoutes.delete("/:id", teamsController.delete)

export { teamsRoutes }