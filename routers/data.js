const router = require("express").Router()
const {
  addData,
  filterData,
  deleteAll,
  getCommonData,
  getSummary,
} = require("../controllers/data")

router.route("/").post(addData)
router.post("/filter", filterData)
router.get('/delete',deleteAll)
router.get('/common',getCommonData)
router.get('/summary',getSummary)
module.exports = router
