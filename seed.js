import { dbConnection, closeConnection } from './config/mongoConnection.js';
import * as gyms from './data/gyms.js';
import * as users from './data/users.js';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // Clear existing collections
    console.log('Database cleared. Seeding data...');

    try {
        // Seed Gyms and add data
        console.log('Seeding gyms...');
        const planetFitness = await gyms.createGym(
            'Planet Fitness', 'pFitness1', 'iLoveGym1!',
            'location1@planetfitness.com', '605 Washington St, Hoboken, NJ.',
            { 'Mon': '08am-10pm', 'Tue': '08am-10pm', 'Wed': '08am-10pm',
              'Thu': '08am-10pm', 'Fri': '08am-10pm', 'Sat': '08am-02pm', 'Sun': '08am-02pm' }
        )
        await gyms.updateGym(planetFitness._id, 
            {
                'equipment': [ // Equipment
                    { "type": "treadmill", "count": 5 },
                    { "type": "weights", "count": 20 },
                    { "type": "stair-climber", "count": 4 }
                ], 
                'classes': [ // Classes
                    { "name": "Bodyweight Classes", "description": "Classes using your body weight for resistance." },
                    { "name": "Circuit Training", "description": "High-intensity circuit training for full-body conditioning." }
                ],
                'extra': [ // Extra amenities
                    'Juice Bar', 
                    'Locker Rooms'
                ],
                'link': 'https://www.planetfitness.com'
            }
        )
        
     
        const crunchFitness = await gyms.createGym(
            'Crunch Fitness', 'cFitness1', 'workoutNow2!',
            'location1@crunchfitness.com', '113 River St, Hoboken, NJ.',
            { 'Mon': '10am-08pm', 'Tue': '10am-08pm', 'Wed': '10am-08pm', 
              'Thu': '10am-08pm', 'Fri': '10am-08pm', 'Sat': 'Closed', 'Sun': 'Closed' }
        )

        await gyms.updateGym(crunchFitness._id, 
            {
                'equipment': [ // Equipment
                    { "type": "bench press", "count": 3 },
                    { "type": "lat pull down", "count": 4 }
                ], 
                'classes': [ // Classes
                    { "name": "Zumba", "description": "A fun and energetic dance workout." },
                    { "name": "Pilates", "description": "A low-impact workout focusing on core strength and flexibility." }
                ],
                'extra': [ // Extra amenities
                    'Vending Machines',
                    'Sauna'
                ],
                'link': 'https://www.crunch.com'
            }
        )


        const laFitness = await gyms.createGym(
            'LA Fitness', 'laFit123', 'StayStrong456!',
            'support@lafitness.com', '150 Sunset Blvd, Los Angeles, CA.',
            { 'Mon': '05am-10pm', 'Tue': '05am-10pm', 'Wed': '05am-10pm',
              'Thu': '05am-10pm', 'Fri': '05am-09pm', 'Sat': '07am-07pm', 'Sun': '07am-07pm' },
        );
        await gyms.updateGym(laFitness._id, 
            {
                'equipment': [ // Equipment
                    { "type": "bench press", "count": 4 },
                    { "type": "lat pull down machine", "count": 3 }
                ], 
                'classes': [ // Classes
                    { "name": "Zumba", "description": "A dance workout with great music." },
                    { "name": "Body Pump", "description": "Full body workout using weights to tone muscles." }
                ],
                'extra': [ // Extra amenities
                    'Juice Bar',
                    'Basketball Court'
                ],
                'link': 'https://www.lafitness.com'
            }
        )


        const equinox = await gyms.createGym(
            'Equinox', 'equinoxLuxury', 'LuxuryFit2024!',
            'contact@equinox.com', '300 Park Ave, New York, NY.',
            { 'Mon': '06am-11pm', 'Tue': '06am-11pm', 'Wed': '06am-11pm',
              'Thu': '06am-11pm', 'Fri': '06am-10pm', 'Sat': '08am-06pm', 'Sun': '08am-06pm' }
        )
        await gyms.updateGym(equinox._id, 
            {
                'equipment': [ // Equipment
                    { "type": "treadmills", "count": 4 },
                    { "type": "rowing machines", "count": 5 }
                ], 
                'classes': [ // Classes
                    { "name": "Yoga", "description": "Relaxing yoga classes for all levels." },
                    { "name": "Spin", "description": "High-intensity cycling classes." }
                ],
                'extra': [ // Extra amenities
                    'Smoothie Bar',
                    'Sauna'
                ],
                'link': 'https://www.equinox.com'
            }
        )


        const anytimeFitness = await gyms.createGym(
            'Anytime Fitness', 'anytime247', 'AlwaysOpen123!',
            'info@anytimefitness.com', '200 Main St, Chicago, IL.',
            { 'Mon': '12am-12am', 'Tue': '12am-12am', 'Wed': '12am-12am',
              'Thu': '12am-12am', 'Fri': '12am-12am', 'Sat': '12am-12am', 'Sun': '12am-12am' },
        );
        await gyms.updateGym(equinox._id, 
            {
                'equipment': [ // Equipment
                    { "type": "treadmills", "count": 6 },
                    { "type": "kettlebells", "count": 10 }
                ], 
                'classes': [ // Classes
                    { "name": "Strength Training", "description": "Focus on building strength using free weights." },
                    { "name": "Cardio", "description": "Cardio workouts to help with overall fitness." }
                ],
                'extra': [ // Extra amenities
                    '24/7 Access',
                    'Showers'
                ],
                'link': 'https://www.anytimefitness.com'
            }
        )
        console.log('Gyms seeded successfully.');

        

        // Seed Users
        console.log('Seeding users...');
        const jason = await users.createUser(
            'Jason', 'Casper', 'jcasp09', 'myPassword1!',
            'jcasper@stevens.edu', '2003-10-02', 'Jackson', 'NJ'
        );
        const vincent = await users.createUser(
            'Vincent', 'Cancelliere', 'vcool1015', 'iLove546!',
            'vcancell@stevens.edu', '2003-10-15', 'Jackson', 'NJ'
        );
        const aidan = await users.createUser(
            'Aidan', 'Cancelliere', 'T1GIT', 'fortniteFan15!',
            'acancell@stevens.edu', '2003-10-15', 'Jackson', 'NJ'
        );
        const trevin = await users.createUser(
            'Trevin', 'Rieger', 'srieger', 'callOfDuty0!',
            'srieger@shu.edu', '2003-08-23', 'Jackson', 'NJ'
        );
        const emily = await users.createUser(
            'Emily', 'Smith', 'emilyS123', 'superSafe1!',
            'emily.smith@gmail.com', '1998-07-15', 'Boston', 'MA'
        );
        const matt = await users.createUser(
            'Matt', 'Johnson', 'mattJ321', 'passWord1234!',
            'matt.j@gmail.com', '1995-01-10', 'Dallas', 'TX'
        );
        console.log('Standard users seeded successfully.');

        // Add Reviews to Gyms
        console.log('Adding reviews for gyms...');
        await gyms.addReview(planetFitness._id, aidan.userId, 5, 'Great place to work out!');
        await gyms.addReview(crunchFitness._id, trevin.userId, 4, 'Nice gym, but limited hours on weekends.');
        await gyms.addReview(planetFitness._id, vincent.userId, 3, 'Good equipment, but too crowded.');
        await gyms.addReview(crunchFitness._id, emily.userId, 2, 'Needs better hygiene in locker rooms.');
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
