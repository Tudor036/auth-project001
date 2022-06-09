# Auth Project

This is more of a backend web app, which was intended to
clarify the authentication and authorization process when it
comes to a web app.

To start the app, just run the following command in the terminal:  
``` npm run start ```

Accounts:

- user:
  - user@example.com
  - userexample
- admin:
  - admin@example.com
  - adminexample

## __The stack__

I used Javascript as the main language for this project.

For the interface I used  *```ejs```* and *```css```*. I created a main page,
which is called *```layout.ejs```* and there I've included the header element,
the current page and the footer.  *```Webpack```*  was used here too. It bundled
the scripts meant for the frontend part of the application

When building the backend I used the node.js framework  *```express.js```*
and *```Firebase```*. Express.js was used mostly for routing and Firebase
was a replacement for database and was also used at the authentication
adn authorization system.

## __Things I've learned__

- How to work with *```ejs```*
- How to implement cookie functionality
- How to implement private routes (authentication, authorization)
- How to work more efficiently with *```Firebase```*
