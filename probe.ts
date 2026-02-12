
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

console.log('Testing PrismaClient...');
try {
    const prisma = new PrismaClient({
        log: ['info'],
    });
    console.log('Client created successfully');

    // Explicitly call $connect to see if it fails
    prisma.$connect().then(() => {
        console.log('Connected!');
        prisma.$disconnect();
    }).catch(err => {
        console.error('Connection failed:', err);
        prisma.$disconnect();
    });

} catch (e) {
    console.error('Instantiation failed:', e);
}
