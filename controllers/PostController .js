import PostModel from '../models/Post.js'

export const crestePost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            // viewsCount: req.body.viewsCount,
            user: req.userId,
        })
        const post = await doc.save()
        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unsuccessful post creating' })
    }

}

export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: 'Not found' })
    }
}

export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id
        const post = PostModel.findByIdAndUpdate(
            {  _id: postId },             // param to search
            { $inc: { viewsCount: 1 } },  // what we want to update and how
            { returnDocument: 'after' },  //what condition we want to return
            (err, doc) => {
                if(err){
                    console.log(err)
                    res.status(500).json({ message: 'Unsuccessful post returning' })
                }
                if(!doc){
                    res.status(404).json({ message: 'Post not found' })
                }
                res.json(doc)
            }  
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Post couldn\'t be found'})
    }
}
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            { _id: postId },
            { title: req.body.title,
            text: req.body.text,    
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            },
        )
        res.json({ message: 'Post updated'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Post couldn\'t be updated'})
    }
}
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.deleteOne( { _id: postId }, (err, doc) => {
            if(err){
                console.log(err)
                return res.status(500).json({ message: 'Post couldn\'t deleted' })
            }
            if(!doc){
                return res.status(404).json({ message: 'Post not found' })
            }
            res.json({ message: 'Post deleted' })
        })
    } catch (error) {
        
    }
}