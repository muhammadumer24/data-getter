const router = require("express").Router()
const { deleteAll } = require("../controllers/data")
const {  setSectionId } = require("../controllers/users")
router.get('/set',setSectionId)
router.get('/delete',deleteAll)
module.exports = router
