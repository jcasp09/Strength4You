import {dbConnection, closeConnection} from './config/mongoConnection.js'
import * as gyms from './data/gyms.js'
import * as users from './data/users.js'


const db = await dbConnection()
await db.dropDatabase() // clear collections


// Seed Gyms
const planetFitness = await gyms.createGym(
    'Planet Fitness', 'pFitness1', 'iLoveGym1!', 
    'location1@planetfintess.com', '605 Washington St, Hoboken, NJ.',
    {'Mon': '08am-10pm', 'Tue': '08am-10pm', 'Wed': '08am-10pm', 
     'Thu': '08am-10pm', 'Fri': '08am-10pm', 'Sat': '08am-02pm',
     'Sun': '08am-02pm'},
    'gym'
)
const crunchFitness = await gyms.createGym(
    'Crunch Fitness', 'cFitness1', 'workoutNow2!', 
    'location1@crunchfintess.com', '113 River St, Hoboken, NJ.',
    {'Mon': '10am-08pm', 'Tue': '10am-08pm', 'Wed': '10am-08pm', 
     'Thu': '10am-08pm', 'Fri': '10am-08pm', 'Sat': 'Closed',
     'Sun': 'Closed'},
    'gym'
)


// Seed Users (admin)
const jason = await users.createUser(
    'Jason', 'Casper', 'jcasp09', 'myPassword1!',
    'jcasper@stevens.edu', '2003-10-02', 'Jackson',
    'New Jersey', 'admin'
)
const vincent = await users.createUser(
    'Vincent', 'Cancelliere', 'vcool1015', 'iLove546!',
    'vcancell@stevens.edu', '2003-10-15', 'Jackson',
    'New Jersey', 'admin'
)



// Seed Users (user)
const aidan = await users.createUser(
    'Aidan', 'Cancelliere', 'T1GIT', 'fortniteFan15!',
    'acancell@stevens.edu', '2003-10-15', 'Jackson',
    'New Jersey', 'user'
)
const trevin = await users.createUser(
    'Trevin', 'Rieger', 'srieger', 'callOfDuty0!',
    'srieger@shu.edu', '2003-08-23', 'Jackson',
    'New Jersey', 'user'
)



console.log('Done seeding database');
await closeConnection();