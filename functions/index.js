import functions from "firebase-functions"
import express from "express"
import cors from 'cors'
import { login, signup } from "./src/user.js"
import { getShows, addShow } from "./src/shows.js"

const app = express() // creates our express app
app.use(cors())
app.use(express.json())


//this is my user routes
app.post("/signup", signup)
app.post("/login", login)

// Show routes
app.get("/shows", getShows)
app.post("/shows", addShow)


//lets use run locally wihtout emulators:
app.listen(3000, () => console.log(`listening on http://localhost:3000 ...`))

export const api = functions.https.onRequest(app) // exports our cloud function