import {Router} from 'express'
const router = Router()



router.route('/user').get(async (req, res) => {
    return res.status(200).render('userprofile', {...req.session.user});
});

router.route('/gym').get(async (req, res) => {
    return res.status(200).render('gymprofile');
});
  
export default router