const express = require('express')
const { contentType } = require('express/lib/response')
const app = express()
const port = 4131
const session = require('express-session')


const {
  addUsers,
  getUser,
  addPost,
  getEveryPost,
  getPostByUserId,
  getPostSortLikes,
  addLike,
  getLike,
  deletePost,
  UpdatePost,
} = require('./data.js');

const authorizeMiddleware = (req, res, next) => {

  const userId = req.session.userId;
  const username = req.session.username;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  req.userId = userId;
  req.username = username;

  next();
  
};


const secret = "supersecret";

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
}))


app.set("views", "templates");
app.set("view engine", "pug");


app.use("/css", express.static("resources/css"));
app.use("/js", express.static("resources/js"));
app.use("/images", express.static("resources/images"));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.get('/', (req,res) => {
    res.render("mainpage.pug");
})
app.get('/main', (req,res) => {
    res.render("mainpage.pug");
})

app.get('/loginpage', (req,res) => {
    res.render("loginpage.pug");
})
app.get('/editpost',authorizeMiddleware, (req,res) => {
    res.render("editpost.pug");
})

app.post('/api/user', async (req,res) =>{
  if (!req.body.username || !req.body.password) {
      res.status(401).json({ error: "Missing username and/or password"});
      return;
   }
   else{
     const response = await getUser(req.body.username)
       if (response.length === 0){
          const result = await addUsers(req.body);
          if (result.affectedRows > 0){
            res.sendStatus(200)

          }
          

       }
       else {
        res.status(400).send("username already taken");

       }
       

   }
})
app.post('/api/auth', (req,res) =>{
  if (!req.body.username || !req.body.password) {
      res.status(401).json({ error: "Missing username and/or password"});
      return;
   }
   else {
    getUser(req.body.username).then((response) => {

       if (response.length === 0){
        res.status(401).json({ error: "username doesn't exist"});

       }
       else {

         if (response[0] ["password"] != req.body.password){
            res.status(401).json({ error: "password not correct"});

         }
         else{
            req.session.username = req.body.username; // Initialization of req.session.username
            req.session.userId = response[0] ["userId"];

            
            res.sendStatus(200);  // loged in

         

         }

       }
    })
  }


})
app.post('/api/post',authorizeMiddleware,async(req,res) =>{
  const postMessage = req.body.postMessage;
  const username = req.username;
 
  if (postMessage.length > 100) {
    // Respond with an error indicating that the post is too long
    res.status(400).json({ error: 'Post exceeds the character limit of 100' });
  } 
  else if (postMessage.length === 0){
    res.status(400).json({ error: 'need to enter a post' });
  }
  else {
    const id = req.userId;

    const result = await addPost(postMessage,id,username);
    if (result.affectedRows > 0 ){
      res.sendStatus(200);  // Created
    }
    else {
      res.status(400).json({ error: 'Post was not added successfully' });

    }
    

  }
  


})
app.post('/api/updatepost',authorizeMiddleware,async(req,res) =>{
  

  const newMessage = req.body.updatedMessage;
  

  if (newMessage.length > 100) {
    res.status(400).json({ error: 'Post exceeds the character limit of 100' });
  } 
  else if (newMessage.length === 0){
    res.status(400).json({ error: 'need to enter a post' });
  }
  
  const id = req.body.editID;
  
  const result = await UpdatePost(newMessage,id);
  if (result.affectedRows > 0) {

    res.status(200).json({ error: 'Post was updated successfully' });
  }
  else {
    res.status(400).json({ error: 'Post was not updated successfully' });

  
    

  }


  
})

app.get("/chatroom", authorizeMiddleware, async (req, res)=> {
    // parameter = "page" -- 5 items per page.
    let page = parseInt(req.query.page ?? 1)
    if (! page) {
        // this should catch "Nan" from a bad parseInt
        page = 1;
    }
    let offset = (page-1)*5
    // -1 so that we go to 0 indexing.
    if (req.query.sort === 'likes') {
        let posts = await (await getPostSortLikes()).slice(offset, offset+5)
        res.render("chatroom.pug", { posts, page});
    } 
    else {
      let posts = await (await getEveryPost()).slice(offset, offset+5)

    
      res.render("chatroom.pug", {posts, page})

    }
    
    
     
})


app.get('/profile',authorizeMiddleware, async (req,res) =>{
  
    const posts = await getPostByUserId(req.userId)

    res.status(200).render("profile.pug",{posts})

        

})
app.post('/api/like' , async (req,res) => {
  const id = req.body.id
  
  
  const result = await addLike(id)

  if (result){
    const like = await getLike(id)
    const like_count = like[0]["like_count"];


    res.status(200).json({like_count: like_count}); 
  }
  else {
    res.status(400).send("not liked"); 
  }
   



})

app.delete('/api/deletepost',async (req,res) => {
  const id = req.body.id
  const result = await deletePost(id)

  if(result.affectedRows > 0){
      res.status(200).send("sucessfully deleted");  // deleted

  }
  else{
    res.status(400).send("not deleted");  // not deleted
  }

})

app.post('/api/lougout',async (req,res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.redirect('/loginpage')

      }
    });
  } 
})


app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})
  



app.listen(port , () => {
  console.log(`Example app listening on port ${port} http://localhost:4131/`)
})