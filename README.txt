
IMAGE SOURCE: 
https://unsplash.com/photos/brown-ceramic-teacup-XtUd5SiX464

FONT AND ICON SOURCE: 
https://www.fontshare.com/
https://boxicons.com/

TO RUN THIS SOFTWARE: 

1. npm install express
2. node chatserver.js

BRIEF WALK THROUGH THE WEBSITE:

Coffee Chats - landing page 
Press the login button to be redirected to the login page 
Login page - can log in and create accounts
Profile - shows the posts made by the user logged in and the user is able to edit, like, and delete their own posts 
Chatroom - to explore every post made on the website, the user can sort posts with like count, default is sorted with posted time
            and users can like posts. 


FEATURES IMPLEMENTED:

    - Recent Posts view
    - Posts by like-count view
    - Post creation - The user can only create posts from the profile page
    - Post editing - The user can only edit from the profile page
    - Post deleting - The user can only delete from the profile page
    - Post liking
    - Account creation (I.E. a not-logged-in user can create a new account)
    - Logged-in vs. not-logged-in status should be tracked.
    - Posts are associated with a specific user, only the associated user can edit or delete a given post.


CSS FILE NAMES:

main.css - used by profile.pug, editpost.pug, logninpage.pug and chatroom.pug
chatroom.css - used by profile.pug, editpost.pug, and chatroom.pug
landingpage.css - used by the mainpage.pug
