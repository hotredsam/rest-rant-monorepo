const router = require('express').Router();
const db = require("../models");

const { Place, Comment, User } = db;






router.delete('/:placeId/comments/:commentId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    let commentId = Number(req.params.commentId)

    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else if (isNaN(commentId)) {
        res.status(404).json({ message: `Invalid id "${commentId}"` })
    } else {
        const comment = await Comment.findOne({
            where: { commentId: commentId, placeId: placeId }
        })
        if (!comment) {
            res.status(404).json({
                message: `Could not find comment`
            })
        } else if (comment.authorId !== req.currentUser?.userId) {
            res.status(403).json({
                message: `You do not have permission to delete comment "${comment.commentId}"`
            })
        } else {
            await comment.destroy()
            res.json(comment)
        }
    }
})







// Added GET route for /places with debugging line
router.get('/', async (req, res) => {
    console.log("GET /places called");  // Debugging line
    const places = await Place.findAll();
    res.json(places);
});


// Add this route in your places.js
router.get('/:placeId', async (req, res) => {
    const placeId = Number(req.params.placeId);
    const place = await Place.findOne({
        where: { placeId: placeId }
    });

    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }

    res.json(place);
});


// Existing code for POST route to add comments


router.post('/:placeId/comments', async (req, res) => {
    const placeId = Number(req.params.placeId)

    req.body.rant = req.body.rant ? true : false

    const place = await Place.findOne({
        where: { placeId: placeId }
    })

    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` })
    }

    if (!req.currentUser) {
        return res.status(404).json({ message: `You must be logged in to leave a rand or rave.` })
    }

    const comment = await Comment.create({
        ...req.body,
        authorId: req.currentUser.userId,
        placeId: placeId
    })

    res.send({
        ...comment.toJSON(),
        author: req.currentUser
    })
})
    ;

// Add any other routes you might have here

module.exports = router;
