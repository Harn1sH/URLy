import express from 'express'
import * as shortenController from '../controllers/shortenController'

const router = express.Router()

router.post('/', shortenController.urlShortener)
router.get('/:alias', shortenController.urlRedirecter)

export default router;