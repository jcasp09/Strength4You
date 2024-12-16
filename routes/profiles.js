import {Router} from 'express'
const router = Router()
import * as userData from '../data/users.js'
import * as gymData from '../data/gyms.js'


router.route('/user').get(async (req, res) => {
    return res.status(200).render('userprofile');
});

router.route('/gym').get(async (req, res) => {
    return res.status(200).render('gymprofile');
});
  