import request from "supertest";

import { app } from "../app";

import { prisma } from "@database/prisma";

describe("SessionsController", () => {
  let user_id: number

  afterAll(async () => {
    await prisma.users.delete({ where: { id: user_id } })
  })

  it("should authenticate and get access token", async () => {
    const userResponse = await request(app).post("/user").send({
      name: "Auth Test User",
      email: "auth_test_user@example.com",
      password: "password123456"
    })

    user_id = userResponse.body.id

    const sessionResponse = await request(app).post("/session").send({
      email: "auth_test_user@example.com",
      password: "password123456"
    })

    expect(sessionResponse.status).toBe(201)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  })
})