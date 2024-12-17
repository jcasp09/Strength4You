import {Router} from 'express'
const router = Router()
import {gyms} from '../config/mongoCollections.js'


// API Route: Search gyms by name
router.route('/search').post(async (req, res) => {
    // Retrive search fields
    const searchTerms = req.body

    if (!searchTerms || Object.keys(searchTerms).length === 0) {
        return res.status(400).json({ error: 'Search terms are required.' });
    }

    try {
        const gymCollection = await gyms();
        // Build dynamic query object
        const query = {};

        // Handle equipment search
        if (searchTerms.equipment) {
            const equipmentType = searchTerms.equipment;
            query['equipment'] = {
                $elemMatch: { type: equipmentType } // Match gyms where equipment array contains an object with type = equipmentType
            };
        }

        // Handle name and address search
        if (searchTerms.name) {
            const nameTokens = searchTerms.name.split(' ').map(token => token.trim()).filter(Boolean);
            query['name'] = { $regex: nameTokens.join('.*'), $options: 'i' }; // Case-insensitive regex for name
        }
        if (searchTerms.address) {
            const addressTokens = searchTerms.address.split(' ').map(token => token.trim()).filter(Boolean);
            query['address'] = { $regex: addressTokens.join('.*'), $options: 'i' }; // Case-insensitive regex for address
        }

        // Search gyms in the collection using the dynamic query
        const gymsList = await gymCollection.find(query).toArray();

        return res.json(gymsList);
    } catch (e) {
        return res.status(500).json({ error: 'Failed to fetch gyms.' });
    }
});

export default router