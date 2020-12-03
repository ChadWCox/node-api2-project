const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const db = require('../data/db');
router.use(express.json());

//GET ALL POSTS
router.get('/', async (req, res) => {
    try {
        const posts = await db.find('posts');
        if (!posts) {
            res.status(200).json({ message: 'Retrieving Posts...'})
        } else {
            res.status(200).json(posts)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'The posts information could not ber retrieved'})
    }
});

//GET POSTS BY ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const post = await db.findById(id);
        if(!post.length) { 
            res.status(404).json({ message: `The post with id ${id} does not exist.`})
        } else {
            res.status(200).json(post) 
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'The post information could not be retrieved'})
    }
});

//GET COMMENTS
router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const comment = await db.findCommentById(id)
    try {
        if(!comment.length) {
            res.status(404).json({ message: 'The comment with the specified ID does not exist.'})
        } else {
            res.status(200).json(comment)
        }   
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'The comments information could not be retrieved.'})
    }
});

//CREATED NEW POST
router.post('/', async (req, res) => {
    const post = req.body;
    try{
        if (!post.title || !post.contents) {
            res.status(400).json({ message: 'Title and contents are required.'})
        } else {
            await db.insert(post)
            res.status(201).json(post)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'There was an error while saving the post to the database.'})
    }
});

//NEW COMMENT
router.post('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const text = req.body
    const post = await db.findById(id)
    try {
        if(!post.length) {
            res.status(404).json({ messsage: `The post with ID ${id} does not exist.`})
        } else if (!req.body.text) {
            res.status(400).json({ message: 'Please provide text for the comment.'})
        } else {
            await db.insertComment(text).then(res => {
                res.status(201).json(res);
            })
            
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'The comments information could not be retrieved.'})
    }
});

//DELETE POST 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await db.findById(id);
    try {
        if (!post.length) {
            res.status(404).json({ message: `The post with ID ${id} does not exist`})
        } else {
            await db.remove(id);
            res.status(200).json(post)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'The post could not be removed'})
    }
});

// CHANGE POST
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedPost = req.body;
    const post = await db.findById(id)
    try{
        if (!updatedPost.title || !updatedPost.contents) {
            res.status(400).json(({ message: 'Please provide title and contents for the post.'}))
        } else if (!post.length) {
            res.status(404).json({ message: `The post with ID ${id} does not exist.`})   
        } else {
            await db.update(id, updatedPost);
            res.status(200).json(updatedPost)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'The post information could not be modified'})
    }
});

module.exports = router;



