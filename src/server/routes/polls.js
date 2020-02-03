const router = require("express").Router();
const Poll = require("../models/poll.model");

//GET all polls, GET one poll by id, DELETE one poll by id, PUT vote in poll by id

router.route("/").get( async (req, res) => {
    try {
        const polls = await Poll.find({}, "name votes createdAt created_by updatedAt")
                                .sort("-updatedAt");
        res.json(polls);
    } catch (err) {
        res.json(`Error: ${err}`)
    }
});

router.route("/:id").get( async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        res.json({poll});
    } catch (err) {
        res.json(`Error: ${err}`)
    }
});

router.route("/:id").delete( async (req, res) => {
    try {
        await Poll.findByIdAndDelete(req.params.id);
        res.send("The poll has been successfully deleted!");
    } catch (err) {
        res.json(`Error: ${err}`)
    }
})

router.route("/:id").put( async (req, res) => {
    try {
        const {option, options, votes} = req.body;
        const updatedOptions = Object.assign({}, options);
        updatedOptions[option] = options[option] + 1;

        const poll = await Poll.findByIdAndUpdate(req.params.id, {votes: votes + 1, options: updatedOptions, updatedAt: Date.now()}, { new: true});
        res.json({poll});
    } catch (err) {
        res.json(`Error: ${err}`)
    }
});

module.exports = router;