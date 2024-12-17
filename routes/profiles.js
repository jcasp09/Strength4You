import {Router} from 'express'
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
  
export default router