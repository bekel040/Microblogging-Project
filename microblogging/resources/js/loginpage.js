window.addEventListener("DOMContentLoaded", (event) => {

document.querySelector(".submitbttn").addEventListener("click", async function() {
   
   // Get form data
   const username = document.querySelector("#username").value;
   const password = document.querySelector("#password").value;
   
   login(username, password);
});

document.querySelector(".createbttn").addEventListener("click", async function() {
   
   // Get form data
   const username = document.querySelector("#username").value;
   const password = document.querySelector("#password").value;
   
   createAcount(username, password);
});
 

async function login(username, password) {
   const response = await fetch("/api/auth", {
      method: "POST",
      body: new URLSearchParams({ 
         username: username,
         password: password })
   });

   if (response.ok) {
      
      window.location.assign("http://localhost:4131/chatroom");

   }
   else {
      const message = document.querySelector(".message-banner");
      message.style.display = 'block';
      const newMessage = await response.json();
      message.innerText = JSON.stringify(newMessage["error"]);

   }
}

async function createAcount(username, password) {
   const response = await fetch("/api/user", {
      method: "POST",
      body: new URLSearchParams({ 
         username: username,
         password: password })
   });


   if (response.ok) {
      
      const message = document.querySelector(".message-banner");
      message.style.display = 'block';

      message.innerText = "successfully created your account login to access your account";
   }
   else if (response.status === 400 || response.status === 401){

      const message = document.querySelector(".message-banner");
      message.style.display = 'block';

      message.innerText = "account with the same username already exists";


   }
    }


});
