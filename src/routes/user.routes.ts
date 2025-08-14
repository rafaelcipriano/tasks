import { Router } from "express";
import { UserController } from "@controllers/user.controller";

const userRoutes = Router()
const userController = new UserController()

userRoutes.post("/", userController.create)
userRoutes.get("/", userController.index)
userRoutes.patch("/:userId", userController.update)
userRoutes.put("/:userId/update-password", userController.updatePassword)
userRoutes.delete("/:userId", userController.delete)

export { userRoutes }