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
        for (const field in searchTerms) {
            if (searchTerms[field]) {
                // Check if field is address and handle it more specifically
                if (field === 'address') {
                    // Split the search term into words (tokens) and search for each
                    const addressTokens = searchTerms[field].split(' ').map(token => token.trim()).filter(Boolean);
                    query[field] = { $regex: addressTokens.join('.*'), $options: 'i' }; // This searches for "Hoboken" within the address
                } else {
                    // Apply case-insensitive partial match for other fields
                    query[field] = { $regex: searchTerms[field], $options: 'i' };
                }
            }
        }

        // Search gyms in the collection using the dynamic query
        const gymsList = await gymCollection.find(query).toArray();

        return res.json(gymsList);
    } catch (e) {
        return res.status(500).json({ error: 'Failed to fetch gyms.' });
    }
});

export default router