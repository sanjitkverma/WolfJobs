const express = require("express");

const router = express.Router();

const usersApi = require("../../../controllers/api/v1/users_api");

const required_skills = require("../../../skills/required_skills");

const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();

router.post("/create-session", usersApi.createSession);
router.post("/signup", usersApi.signUp);
router.post("/edit", jsonParser, usersApi.editProfile);
router.get("/getprofile/:id", usersApi.getProfile);
router.get("/search/:name", usersApi.searchUser);
router.post("/createhistory", usersApi.createHistory);
// router.get('/gethistory/:userId',usersApi.getHistory);
router.get("/gethistory", usersApi.getHistory);
router.post("/createjob", jsonParser, usersApi.createJob);
router.get("/", usersApi.index);
router.get("/fetchapplications", usersApi.fetchApplication);
router.post("/acceptapplication", usersApi.acceptApplication);
router.post("/modifyApplication", jsonParser, usersApi.modifyApplication);
router.post("/generateOTP", usersApi.generateOtp);
router.post("/verifyOTP", usersApi.verifyOtp);
router.post("/rejectapplication", usersApi.rejectApplication);
router.post("/closejob", jsonParser, usersApi.closeJob);
router.post("/createapplication", jsonParser, usersApi.createApplication);
router.get("/skills", (req, res) => {
    try {
        res.json(required_skills.skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
