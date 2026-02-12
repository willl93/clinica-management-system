const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    // 1. Create Default Clinic
    const clinic = await prisma.clinic.upsert({
        where: { id: 'default-clinic' },
        update: {},
        create: {
            id: 'default-clinic',
            name: 'Clínica Principal',
            address: 'Rua Exemplo, 123',
            phone: '(11) 99999-9999',
            color: '#3B82F6'
        }
    })

    // 2. Create Super Admin
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { role: 'SUPER_ADMIN' },
        create: {
            name: 'Administrador',
            username: 'admin',
            password,
            role: 'SUPER_ADMIN',
            clinicId: clinic.id
        }
    })

    console.log({ clinic, admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
