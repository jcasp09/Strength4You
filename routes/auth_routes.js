import {Router} from 'express'
const router = Router()
import * as userData from '../data/users.js'
import * as validate from '../validation.js'



router.route('/').get(async (req, res) => {
  // rootRedirect middleware restricts access to this route 
  return res.json({error: 'YOU SHOULD NOT BE HERE!'})
});

router.route('/home').get(async (req, res) => {
  return res.render('home', { user: req.session.user });
});


router.route('/home/search').get(async (req, res) => {
  return res.render('search')
});



router.route('/signout').get(async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy()
      return res.render('signout')
    }
    else {
      return res.redirect('/home')
    }
  } catch (e) {
    return res.status(500).render('error', {error: e});
  }
});


export default router