import { dbConnection, closeConnection } from './config/mongoConnection.js';
import * as gyms from './data/gyms.js';
import * as users from './data/users.js';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // Clear existing collections
    console.log('Database cleared. Seeding data...');

    try {
        // Seed Gyms
        console.log('Seeding gyms...');
        const planetFitness = await gyms.createGym(
            'Planet Fitness', 'pFitness1', 'iLoveGym1!',
            'location1@planetfitness.com', '605 Washington St, Hoboken, NJ.',
            { 'Mon': '08am-10pm', 'Tue': '08am-10pm', 'Wed': '08am-10pm', 
              'Thu': '08am-10pm', 'Fri': '08am-10pm', 'Sat': '08am-02pm', 'Sun': '08am-02pm' },
            'gym'
        );
        const crunchFitness = await gyms.createGym(
            'Crunch Fitness', 'cFitness1', 'workoutNow2!',
            'location1@crunchfitness.com', '113 River St, Hoboken, NJ.',
            { 'Mon': '10am-08pm', 'Tue': '10am-08pm', 'Wed': '10am-08pm', 
              'Thu': '10am-08pm', 'Fri': '10am-08pm', 'Sat': 'Closed', 'Sun': 'Closed' },
            'gym'
        );
        console.log('Gyms seeded successfully.');

        // Seed Admin Users
        console.log('Seeding admin users...');
        const jason = await users.createUser(
            'Jason', 'Casper', 'jcasp09', 'myPassword1!',
            'jcasper@stevens.edu', '2003-10-02', 'Jackson', 'New Jersey', 'admin'
        );
        const vincent = await users.createUser(
            'Vincent', 'Cancelliere', 'vcool1015', 'iLove546!',
            'vcancell@stevens.edu', '2003-10-15', 'Jackson', 'New Jersey', 'admin'
        );
        console.log('Admin users seeded successfully.');

        // Seed Standard Users
        console.log('Seeding standard users...');
        const aidan = await users.createUser(
            'Aidan', 'Cancelliere', 'T1GIT', 'fortniteFan15!',
            'acancell@stevens.edu', '2003-10-15', 'Jackson', 'New Jersey', 'user'
        );
        const trevin = await users.createUser(
            'Trevin', 'Rieger', 'srieger', 'callOfDuty0!',
            'srieger@shu.edu', '2003-08-23', 'Jackson', 'New Jersey', 'user'
        );
        console.log('Standard users seeded successfully.');

        // Add Reviews to Gyms
        console.log('Adding reviews for gyms...');
        await gyms.addReview(planetFitness._id, aidan.userId, 5, 'Great place to work out!');
        await gyms.addReview(crunchFitness._id, trevin.userId, 4, 'Nice gym, but limited hours on weekends.');
        await gyms.addReview(planetFitness._id, vincent.userId, 3, 'Good equipment, but too crowded.');
        console.log('Reviews added successfully.');
    } catch (error) {
        console.error('Error during database seeding:', error);
    } finally {
        console.log('Closing database connection...');
        await closeConnection();
        console.log('Database connection closed.');
    }
};

main();
