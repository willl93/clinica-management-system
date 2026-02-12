const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true, clinic: { select: { name: true } } }
    })
    console.log('Users:', JSON.stringify(users, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
