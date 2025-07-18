import express from "express";
import { routes } from "@/routes/index.routes"
import { errorHandler } from "@/middleware/errorHandler"

const app = express()

app.use(express.json())
app.use(routes)

app.use(errorHandler)

export { app }