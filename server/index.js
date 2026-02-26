import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

const app = express()

app.use(express.json())
app.use(cors())
app.use(ClerkExpressRequireAuth())

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/', (req, res) => res.send('Server is Live!'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

