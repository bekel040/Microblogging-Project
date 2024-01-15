
window.addEventListener("DOMContentLoaded", (event) => {
    const postBttn = document.querySelector(".postbttn");
    if (postBttn != null){
        postBttn.addEventListener("click", async function() {
   
        // Get form data
        const postMessage = document.querySelector("#post_input").value;

        postChat(postMessage);

        });
        // handling posting a message 
        async function postChat(postMessage) {
                const message = {postMessage: postMessage}
                const response = await fetch("/api/post", {
                    method: "POST",
                    headers: {
                            'Content-Type': 'application/json'
                        },
                    body: JSON.stringify(message)

                });
                if (response.ok){
                    window.location.assign("http://localhost:4131/profile");
                }
                else if (response.status === 400){
                    const message = document.querySelector(".message-banner");
                    message.style.display = 'block';
                    const errorMessage = await response.json();
                    message.innerText = JSON.stringify(errorMessage["error"]);


                }
        
                
        }

    }
    
    const list_of_posts = document.querySelector(".lst-of-posts");

    if (list_of_posts != null ) {

        list_of_posts.addEventListener("click", function(event) {
                    LikePost(event);
        })
                
        async function LikePost(event) {
            const clickedbutton = event.target; // gets the element that was clicked on
            if (clickedbutton.className == "likebttn"){  // handling like for posts
                const id = clickedbutton.id
                const post = clickedbutton.parentElement.parentElement.querySelector(".message").textContent;
                const username = clickedbutton.parentElement.parentElement.querySelector(".user").textContent;
                const info = {id: id, post: post, username: username}
                
                const response = await fetch("/api/like", {
                    method: "POST",
                    headers: {
                            'Content-Type': 'application/json'
                        },
                    body: JSON.stringify(info)

                });
                if(response.ok){
                    let like_count = await response.json();
                    like_count = like_count["like_count"];

                    const new_likebttn = `${like_count} ♡`;
         
                    clickedbutton.textContent = new_likebttn;
                }


            }
            else if (clickedbutton.parentElement.className == "deletebttn"){  // handling delete for posts
                const id = clickedbutton.parentElement.id                     // have to use parentElement cause icon is the element that was clicked on 
                console.log("ID",id)
            
                const info = {id: id}
                const response = await fetch("/api/deletepost", {
                    method: "DELETE",
                    headers: {
                            'Content-Type': 'application/json'
                        },
                    body: JSON.stringify(info)

                });
                if (response.ok){
                    location.href = ("/profile");
                }

            }
            else if (clickedbutton.parentElement.className == "editbttn"){  // handling editing for posts

                const editid = clickedbutton.parentElement.id;               // have to use parentElement cause icon is the element that was clicked on 
                localStorage.setItem('editID', editid);
                location.href = ('/editpost');
                
                    

                }
            
            }
                
    }

    // handling updating a post 
    const updatebutton = document.querySelector(".updatebttn")
    console.log("updatebttn",updatebutton)
        
        if (updatebutton != null ){
            updatebutton.addEventListener("click", async function() {

            let updatedMessage = document.querySelector("#update_input").value;
            const editID = localStorage.getItem('editID');
            const info = {editID: editID, updatedMessage: updatedMessage}
            updatePost(info);

        });
        async function updatePost(info){
            const response = await fetch("/api/updatepost", {
                method: "POST",
                headers: {
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify(info)

            });
            if (response.ok){
                location.href = ('/profile');
            }
            else if (response.status === 400){
                const message = document.querySelector(".message-banner");
                message.style.display = 'block';
                const errorMessage = await response.json();
                message.innerText = JSON.stringify(errorMessage["error"]);

            }


        }
    }


});


   