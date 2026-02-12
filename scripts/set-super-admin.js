const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const username = process.argv[2]
    if (!username) {
        console.error('Please provide a username: node scripts/set-super-admin.js <username>')
        process.exit(1)
    }

    try {
        const user = await prisma.user.update({
            where: { username },
            data: { role: 'SUPER_ADMIN' }
        })
        console.log(`User ${user.username} is now a SUPER_ADMIN.`)
    } catch (e) {
        console.error('Error updating user:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
