import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const clinic = await prisma.clinic.create({
        data: {
            name: 'Estetica Premium',
            address: 'Rua das Flores, 123',
        },
    });

    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            name: 'Admin User',
            username: 'admin',
            password: hashedPassword,
            role: 'MANAGER',
            clinicId: clinic.id,
        },
    });

    console.log({ clinic, user });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
