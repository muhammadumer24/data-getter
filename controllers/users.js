const userModel = require("../models/users")
const setSectionId=async(req,res)=>{
  try{
    const lastUserId=await userModel.findOne({}, {}, { sort: { $natural: -1 } });
    let data=''
    let serial_id=1
    if(!lastUserId){
       data=await userModel.create({serial_id,createdAt:Date.now()})
    }
    else{
       serial_id=lastUserId.serial_id+1
      data=await userModel.create({serial_id,createdAt:Date.now()})
    }
    res.send({plugin_id:data.serial_id})
  }catch(err){
    console.log(err)
    res.sendStatus(500)
  }
}
const deleteAll=async (req,res)=>{
  await userModel.deleteMany()
  res.sendStatu(200)
}
module.exports={setSectionId,deleteAll}