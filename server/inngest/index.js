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
                email: data?.email_addresses[0]?.email_addressesFF,
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

//Inngest Functions to save workspace data to database 
const syncWorkspaceCreation = inngest.createFunction(
    { id: ' sync-workspace-from-clerk' },
    { event: 'clerk/organization.created' },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                ownerId: data.create_by,
                image_url: data.image_url,
            }
        })

        //Add creator as Admin member
        await prisma.workspaceMember.create({
            data: {
                userId: data.create_by,
                workspaceId: data.Id,
                role: "ADMIN"
            }
        })


    }
)
// Inngest Function to update workspace data in workspace
const syncWorkspaceUpdation = inngest.createFunction(
    { id: "update-workspace-from-clerk" },
    { event: "clerk/organization.updated" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                slug: data.slug,
                image_url: data.image_url
            }
        })
    }
)

//Inngest function to delete the workspace ffrom the database
const syncWorkspaceDeletion = inngest.createFunction(
    { id: 'delete-workspace-with-clerk' },
    { event: "clerk/prganization.deleted" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.delete({
            where: {
                id: data.id
            }
        })
    }
)
//inngest Function to sace workspace member data to a database 
const syncWokrspaceMemberCreation = inngest.createFunction(
    { id: "sync-workspace-member-from-clerk" },
    { event: "clerk/organizationInvitation.accepted" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspaceMember.create({
            data: {
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: String(data.role_name).toUpperCase(),

            }
        })
    }
)



// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWokrspaceMemberCreation
];