import Router from 'express'
import { signup,  login , logout } from '../controllers/auth.controller.js'

const router = Router()

router.use("/signup", signup)
router.use("/login", login)
router.use("/logout", logout)

export default router
