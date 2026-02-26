import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { WebSocket } from 'ws';
import dotenv from "dotenv";
neonConfig.webSocketConstructor = WebSocket;



const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter });

if(process.env.NODE_ENV === 'development') global.prisma = prisma
// async function main() {
//     const posts = await prisma.post.findByMany()
// }
// main();
export default prisma