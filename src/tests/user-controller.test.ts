import request from "supertest";
import { app } from "../app";
import { prisma } from "@database/prisma";

describe("UserController", () => {
  let userId: number

  afterAll(async () => {
    await prisma.users.delete({ where: { id: userId } })
  })

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/user").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123456"
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Test User")

    userId = response.body.id
  })

  it("shoud throw an error if user same email already exists", async () => {
    const response = await request(app).post("/user").send({
      name: "Duplicate User",
      email: "test@example.com",
      password: "password123456"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Email is already in use.")
  })

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/user").send({
      name: "Test User",
      email: "invalid-email",
      password: "password123456"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("validation error")
  })
})