const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { loginUser, logoutUser } = require("../auth");

router.get('/',asyncHandler(async(req, res)=>{
    const questions = await db.Question.findAll({
        limit: 9,
        order: [
            ['updatedAt', 'DESC'],
        ],
     })

    res.render('questions-list',{
        questions
    })

}))

router.get("/:id(\\d+)",asyncHandler(async(req, res)=>{
    const questionId = parseInt(req.params.id, 10)
    const question = await db.Question.findByPk(questionId,{
        include: db.User
    })
    res.render("question",{question})
}))



module.exports = router;
