import {Router} from 'express'
import * as userData from '../data/users.js'
import * as gymData from '../data/gyms.js'
const router = Router()



router.route('/user').get(async (req, res) => {
    return res.status(200).render('userprofile', {...req.session.user});
});

router.route('/gym').get(async (req, res) => {
    return res.status(200).render('gymprofile');
});

router.route('/gym/:id').get(async (req, res) => {
    // get gym by id then pass in render
    return res.status(200).render('gyminfo', );
});

router.route('/updateuser/:id').post(async (req, res) => {
    // get gym by id then pass in render
    return res.status(200).render('gyminfo', );
});
  
export default router