import { Router } from "express";
import { TeamMembers } from "@controllers/team-members.controller";

import { ensureAuthenticated } from "@middleware/ensureAuthenticated";
import { verifyUserAuthentication } from "@middleware/verifyUserAuthorization";

const teamMembersRoutes = Router()
const teamMembersControllers = new TeamMembers()

teamMembersRoutes.use(ensureAuthenticated, verifyUserAuthentication(["ADMIN"]))

teamMembersRoutes.post("/:teamId", teamMembersControllers.create)
teamMembersRoutes.get("/:teamId", teamMembersControllers.show)
teamMembersRoutes.delete("/:teamId/delete-member", teamMembersControllers.deleteMember)
teamMembersRoutes.delete("/:teamId/delete-team", teamMembersControllers.deleteTeam)

export { teamMembersRoutes }