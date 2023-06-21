const faker = require('faker');

async function generateData() {
  for (let i = 0; i < 10; i++) {
    const lastName = faker.name.lastName();
    const firstName = faker.name.firstName();
    const middleName = faker.name.middleName();
    const gender = faker.random.boolean() ? 'Male' : 'Female';
    const birthdate = faker.date.past();
    const address = faker.address.streetAddress();
    const zip = faker.address.zipCode();
    const rank = faker.random.arrayElement(['Junior', 'Senior', 'Manager']);

    const result = await prisma.data.create({
      data: {
        lastName,
        firstName,
        middleName,
        gender,
        birthdate,
        address,
        zip,
        rank,
      },
    });

    console.log(`Created data entry with ID: ${result.id}`);
  }
}

generateData();
