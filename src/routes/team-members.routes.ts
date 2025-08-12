import { Router } from "express";
import { TeamMembers } from "@controllers/team-members.controller";

import { ensureAuthenticated } from "@middleware/ensureAuthenticated";
import { verifyUserAuthentication } from "@middleware/verifyUserAuthorization";

const teamMembersRoutes = Router()
const teamMembersControllers = new TeamMembers()

teamMembersRoutes.use(ensureAuthenticated, verifyUserAuthentication(["ADMIN"]))

teamMembersRoutes.post("/:team_id", teamMembersControllers.create)
teamMembersRoutes.get("/:team_id", teamMembersControllers.show)
teamMembersRoutes.patch("/:team_id", teamMembersControllers.removeMember)
teamMembersRoutes.delete("/:team_id", teamMembersControllers.delete)

export { teamMembersRoutes }