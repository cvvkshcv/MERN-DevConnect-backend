const express = require('express');
const router = express.Router();
const url = require('url');

const Post = require('../../models/posts');
const Profile = require('../../models/profile');
const postValidator = require('../../validators/post');
/*
@router GET api/posts
@desc 	Get posts
@access Private
*/
router.get('/:post_id?', (req, res) => {
    const post_id = req.params.post_id;
    // If post id comes in url
    if (post_id) {
        Post.findById(post_id)
            .then(posts => {
                res.json({ message : 'single posts', posts })
            })
            .catch(err => {
                console.log((__filename.split('\\').pop()) , 'Line :', __line, __function);
                res.status(400).json({ message : err.message });
            });
        return;
    }
    // else fetch list of posts
    const query = url.parse(req.url, true);
    const start = parseInt(query.query.start) || 0;
    Post.find()
        .sort({ date : -1 })
        .skip(start)
        .limit(10)
        .then(posts => {
            res.json({ message : 'all posts', posts })
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) , 'Line :', __line, __function);
            res.status(400).json({ message : err.message });
        });  
});

/*
@router POST api/posts
@desc 	DELETE post
@access Private
*/
router.delete('/:id', (req, res) => {
    Profile.findOne({ user : req.decoded.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.decoded.id) {
                        res.status(401).json({ message : 'You dont have access to delete this post'});
                    }
                    post.remove()
                        .then(() => res.json({ message : 'Post deleted'}))
                        .catch(err => { 
                            console.log((__filename.split('\\').pop()) , 'Line:', __line, __function);
                            res.status(400).json({ message : err.message });
                        });
                })
                .catch(err => {
                    console.log((__filename.split('\\').pop()) , 'Line :', __line, __function);
                    res.status(400).json({ message : 'No post found' });
                });
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) ,'Line :', __line, __function);
            res.status(400).json({ message : err.message });
        });
});

/*
@router POST api/posts
@desc 	Add new post
@access Private
*/
router.post('/', (req, res) => {

    const { errors, isValid} = postValidator(req.body);
    if (!isValid) res.status(400).json({ errors });

    const tags = (req.body.tags && typeof(req.body.tags) === 'string') ? req.body.tags.split(',') : [];
    const newPost = new Post({
        user : req.decoded.id,
        title : req.body.title,
        content: req.body.text,
        tags : tags
    });
    newPost.save()
        .then(post => res.json({ message : 'Post added successfully', post }))
        .catch(err => {
            console.log((__filename.split('\\').pop()) , __line, __function);
            res.status(400).json({ message : err.message });
        });
});


/*
@router POST api/like/id
@desc 	Add like to post
@access Private
*/
router.post('/like/:id', (req, res) => {
    Profile.findOne({ user : req.decoded.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    let index;
                    const like = post.likes.filter((like, i) => {
                        index = i;
                        return like.user.toString() === req.decoded.id
                    });
                    if (like.length > 0) {
                        post.likes.splice(index, 1);
                        post.save()
                            .then(profile => res.json({ message : 'Post unliked this post' }))
                            .catch(err => {
                                console.log((__filename.split('\\').pop()) , __line, __function);
                                res.status(400).json({ message : err.message });
                            });
                        return;
                    }
                    post.likes = post.likes || [];
                    post.likes.unshift({ user : req.decoded.id });
                    post.save()
                        .then(() => res.json({ message : 'You liked this post'} ))
                        .catch(err => {
                            console.log((__filename.split('\\').pop()) , 'Line :', __line, __function);
                            res.status(400).json({ message : err.message });
                        });
                })
                .catch(err => {
                    console.log((__filename.split('\\').pop()) , 'Line :', __line, __function);
                    res.status(400).json({ message : 'No post found' });
                });
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) ,'Line :', __line, __function);
            res.status(400).json({ message : err.message });
        });
});


//  Delete comment is not implemented yet
router.post('/comment/:post_id/:comment_id', (req, res) => {
    Post.findById(req.params.post_id)
        .then(post => {
            post.comments = post.comments || [];
            const commentedPost = post.likes.filter((like, i) => {
                index = i;
                return like.user.toString() === req.decoded.id
            });
            // more code to come!
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) , 'Line :', __line, __function);
            res.status(400).json({ message : 'No post found' });
        });
});

module.exports = router;