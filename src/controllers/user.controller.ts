import { Request, Response } from "express";

class UserController {
  create(request: Request, response: Response) {
    return response.status(201).json()
  }
}

export { UserController }