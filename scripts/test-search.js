const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Create a dummy patient if not exists (or find one)
    const patientName = "TesteBusca"

    // Clean up previous test
    await prisma.user.deleteMany({ where: { username: "teste_busca_search_test" } })

    await prisma.user.create({
        data: {
            name: patientName,
            username: "teste_busca_search_test",
            password: "123",
            role: "PATIENT",
            clinic: {
                connectOrCreate: {
                    where: { id: "test-clinic" },
                    create: { name: "Test Clinic" }
                }
            }
        }
    })

    console.log("Created patient: " + patientName)

    // 2. Search exact
    const exact = await prisma.user.findMany({
        where: { role: 'PATIENT', name: { contains: 'TesteBusca' } }
    })
    console.log("Exact search found: " + exact.length)

    // 3. Search lowercase
    const lower = await prisma.user.findMany({
        where: { role: 'PATIENT', name: { contains: 'testebusca' } }
    })
    console.log("Lowercase search found: " + lower.length)

    // Cleanup
    await prisma.user.deleteMany({ where: { username: "teste_busca_search_test" } })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
