const { Op, where } = require("sequelize");
const Plans = require("../models/plansModel")

// routes/planRouter.js
const express = require("express")
const planRouter = express.Router();

// GET /plans (excluding basic plan)
planRouter.get("/get", async (req, res) => {
  try {
    const plans = await Plans.findAll({
      where: {
         id: { [Op.ne]: 1 } 
      },
      order: [["id", "ASC"]]
    });
    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching plans",
    });
  }
});

planRouter.get("/get/:id",async (req,res)=>{
  try{
    const {id} = req.params
    const plan = await Plans.findOne({
      where:{
        id: id
      }
    })
    if(plan){
      return res.status(200).json({success:true,message:"plan fetched",data:plan})
    }else{
      return res.status(404).json({success:false,message:"plan not found"})
    }
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching plans",
    });
  }
})

module.exports = planRouter;
