import {Router} from 'express'
import { getGymById } from '../data/gyms.js';
const router = Router()



router.route('/user').get(async (req, res) => {
    return res.status(200).render('userprofile', {...req.session.user});
});

router.route('/gym').get(async (req, res) => {
    return res.status(200).render('gymprofile');
});

router.route('/gym/:id').get(async (req, res) => {
    try {
        const gymId = req.params.id;
        const gym = await getGymById(gymId);

        if (!gym) {
            return res.status(404).render('error', { error: 'Gym not found' });
        }

        return res.status(200).render('gyminfo', { gym });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { error: 'Error retrieving gym details.' });
    }
});


router.get('/search', async (req, res) => {
    try {
        const { nameSearchTerm, addressSearchTerm } = req.query;

        // Validate input (optional)
        const name = nameSearchTerm ? validation.checkString(nameSearchTerm) : null;
        const address = addressSearchTerm ? validation.checkString(addressSearchTerm) : null;

        const gyms = await gymsCollection();

        // Search logic
        const query = {};
        if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
        if (address) query.address = { $regex: address, $options: 'i' }; // Case-insensitive address search

        const results = await gyms.find(query).toArray();

        return res.status(200).render('searchResults', { gyms: results });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { error: 'Error during search.' });
    }
});

  
export default router