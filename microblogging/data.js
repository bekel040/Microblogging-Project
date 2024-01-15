const { use } = require("express/lib/application");
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource
  host: "127.0.0.1",// this will work
  user: "",
  database: "",
  password: "", 
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.
async function addUsers(data){
    let username = data["username"];
    let password = data["password"];
    return await connPool.awaitQuery('INSERT INTO user (username, password) VALUES (?, ?)',[username,password]);


}

async function getUser(username){
  return await connPool.awaitQuery('select * from user where username=?',[username]);

}

async function addPost(message,userId,username){
    
    return await connPool.awaitQuery('INSERT INTO submission (post, user_id, username) VALUES (?, ?, ?)',[message,userId,username]);

}
async function getPostByUserId(user_id){
  return await connPool.awaitQuery('select * from submission where user_id=? order by startTime desc limit 5',[user_id]);

}

async function getEveryPost(){
  return await connPool.awaitQuery('select * from submission order by startTime desc');

}
async function addLike(id){
  return await connPool.awaitQuery('update submission set like_count=like_count + 1 where id =?',[id]);

}
async function getLike(id){
  return await connPool.awaitQuery('select like_count, post from submission where id=?',[id]);

}
async function getPostSortLikes(){
  return await connPool.awaitQuery('select * from submission order by like_count desc');

}
async function UpdatePost(post,id){
  return await connPool.awaitQuery('update submission set post=? where id=?',[post,id]);

}
async function deletePost(id){
  let result = await connPool.awaitQuery('delete from submission where id=?',[id]);
  if(result.affectedRows > 0){
    return result 
  }
  else {
    let response = await connPool.awaitQuery('delete from liketable where submission_id=?',[id]);
    if (response.affectedRows > 0){
      return await connPool.awaitQuery('delete from submission where id=?',[id]);
    }
  }

}

module.exports = {addUsers,getUser,addPost,getPostByUserId,addLike,getLike,getPostSortLikes,deletePost,getEveryPost,UpdatePost};