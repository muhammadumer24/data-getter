const jwt = require("jsonwebtoken")
const userModel = require("../models/users")
module.exports = async (req, res, next) => {
  try {
    const { token } = req.cookies
    const result = jwt.decode(token)
    const { password } = await userModel.findById(result._id)
    console.log(password)
    if (password !== result.password) return res.sendStatus(400)
    next()
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
}
