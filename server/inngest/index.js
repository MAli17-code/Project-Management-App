import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Project-Management" });


//Inngest Functionc to save user Data to a data base
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email[0]?.email,
                name: data?.first_name + "  " + data?.last_name,
                Image: data?.Image_url,
            }
        })
    }

)


//Inngest Functionc to delete Data to a data base
const syncUserDeletion = inngest.createFunction(
    { id: 'deletion-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })
    }
)

//Inngest Functionc to delete Data to a data base
const syncUserUpdate = inngest.createFunction(
    { id: 'Update-from-clerk' },
    { event: 'clerk/user.Updated' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                email: data?.email[0]?.email,
                name: data?.first_name + "  " + data?.last_name,
                Image: data?.Image_url,
            }
        })
    }

)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate
];