# Collab-Server
## Description
This is the server-side code for the groups, posts, and comments of the [client-side Collab app](https://collab-app-smoky.vercel.app/)
- [GitHub Repo for Collab (client-side)](https://github.com/christineyoo/collab-app)

## Features
### Groups table
- The `groups` table stores the data about the courses (or groups), "Integrated Math 1", "Integrated Math 2", "Integrated Math 3", and "Introduction to Data Science."
- [Click here see the 'groups' data](https://christine-collab.herokuapp.com/api/groups)

### Posts table
- The `posts` table stores the data about each post. Each post has an id, post name, content, author, group id, and date. Each post references a group.
- [Click here see the 'posts' data](https://christine-collab.herokuapp.com/api/posts)


### Comments table
- The `comments` table stores the data about each comment. Each comment has an id, content, author, post id, and date. Each comment references a post.
- [Click here see the 'comments' data](https://christine-collab.herokuapp.com/api/comments)

#### ER Diagram
![image](https://user-images.githubusercontent.com/76637034/119249338-9cf2d280-bb4c-11eb-8715-4ec6b00fa9d0.png)

## Technologies used
- Node.js
- Express, Express Router
- Knex
- SQL
- PostgreSQL
- Testing with Mocha, Chai, and Supertest
- Heroku
