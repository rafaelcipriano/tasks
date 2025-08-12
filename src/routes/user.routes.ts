import { Router } from "express";
import { UserController } from "@controllers/user.controller";

const userRoutes = Router()
const userController = new UserController()

userRoutes.post("/", userController.create)
userRoutes.get("/", userController.index)
userRoutes.patch("/:id", userController.update)
userRoutes.put("/:id/password", userController.updatePassword)
userRoutes.delete("/:id", userController.delete)

export { userRoutes }