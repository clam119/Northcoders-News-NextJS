# Northcoders News NextJS - Introduction
This project is based on my original Northcoders News Project that was split up into two parts: the [Front-End](https://github.com/clam119/northcoders-news) that was built using React, JavaScript and TailwindCSS, and the [Back-End](https://github.com/clam119/northcoders-news-api) that was built using JavaScript and Express/Node with Jest being the choice of testing framework.

Northcoders News NextJS in a nutshell is a combination of the two previous projects mentioned above that was created using the Next.JS Framework so that both the Front-End and Back-End server logics are in a single repository.

If your browser does not support the viewing of JSON objects, then please consider installing [this extension](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh).

This repostitory uses the current versions of Postgres V14 and Node V18.10.0, and as such it is recommended to use these versions or greater to ensure that this project can be run locally. 

If you'd like to view a live version of this API, please click the link below:

[Live Version](https://vercel.com/placeholder)

## Technologies Explored
The technologies that I have selected and chosen to further explore with this project are:
* TypeScript - I have previously used TypeScript for my [Northcoders Final Project](https://northcoders.com/projects/nov-2022/find-n-dine) and more recently the [Advent of Code 2022](https://github.com/clam119/advent-of-code-2022) and have really grown to love the inherent type safety and improved developer experience with the language. As a result, I want to dive more into using TypeScript and becoming more familiar with the language.
* Next.JS - I originally became aware of the Next.JS framework because of its resounding popularity in the Front-End Developer space and researched the benefits of using Next.JS. At first I believed it to only be a solution to React's inability for SEO, but it stems deeper. I have chosen Next.JS as my main framework of choice because it allows me to create my Back-End API endpoints easily with its built-in routing system and pages/app directory for the React/Front-End portion of the project.

## Challenges Encountered Thus Far
* The first challenge that I have had to face was with understanding how the API Routing in Next.JS worked. However, as the documentation was intuitive with how API Routing works based on files inside the `/api/` directory, it did not take long to implement my first working API endpoint.
* The second challenge that I have had to face was setting up my testing suite. Although the tests that are used in this project are similar to that of the previous [Back-End API](https://github.com/clam119/northcoders-news-api) - it differs in how it goes about creating mock calls to the API's endpoint without making changes to the database. The trickiest when setting up the test suite was that previously I had used Supertest and an Express Server to make actual calls to my API's database. However, as I am no longer using Express - I had to find a way to get the same results I would have with mocking. The solution to this was to use the `node-mock-https` package with a connection to my PostgreSQL Database & Handler Function in order to mock a response.

## Setup & Installation
If you would like to install the project on your local machine then please clone the repository below:
> ```https://github.com/clam119/Northcoders-News-NextJS.git```

Once you have successfully cloned this repostitory, please proceed by ensuring that you're inside the directory and run the following command to install the dependencies that will be required to run this project:
> ```npm install```

Upon installing the required dependencies, please create the two required environment variable files in the root folder with the following commands:
> ```echo "PGDATABASE = nc_news_test" >> .env.test```

> ```echo "PGDATABASE = nc_news" >> .env.development```

After successfully creating the required environment variables on the root folder. Please run the following commands to create both the test & development databases:
> ```npm run setup-dbs```

> ``` npm run seed```

With this, you will have now complete access to the repostitory. You will be able to navigate below to the available endpoints and test the available endpoints locally using Jest.

## Testing Endpoints With Jest & Localhost
This project has been created with the core Agile practice of TDD (Test-Driven-Development) using the popular Jest Testing framework to ensure that the API works as it is intended to.

Please enter the following command to view the tests that have been created in mind for this project, and feel free to both test & add/remove tests incrementally on your own local copy of this repository:
> ```npm test```

Lastly, if you would like to access the API on your localhost upon successfully setting up this API, please run this following command and navigate to the endpoints available below:
> ```npm run dev```

## API Documentation
If you would like to view documentation for this API that includes all of the endpoints included below, please click this: [Northcoders News API Documentation](https://northcoders-news-api-production.up.railway.app/)

## Available Endpoints
* [x] [GET /api/](localhost:9090/api) - This will serve up a JSON representation of all the available endpoints of the API.
* [x] [GET /api/topics](localhost:9090/api/topics) - This will return an array of all topics that are currently available.
* [x] [POST /api/topics](localhost:9090/api/topics) - This will apost a new topic to the API's database if given a valid "slug" and "description". Upon a successful post request to this endpoint, the posted topic will be returned to the user. An example of a valid POST request would be: `{ slug: "Chocolate", description: "Anything related to chocolates!" }`  
* [x] [GET /api/articles](localhost:9090/api/articles) - This will return an array of all articles that are currently available.
* [x] [POST /api/articles](localhost:9090/api/articles) - This will post a new article to the API's database if given a valid topic & author and the body & title are not empty. An example of a valid article would be: `{ author: 'rogersop', title: 'A new article WOW!', topic: 'mitch', body: 'What should I write?' }`  and upon a successful post, this posted article will be returned to the user.
* [x] [GET /api/articles/:article_id](localhost:9090/api/articles/:article_id) - This will return a single article that matches the requested ID passed in by the user.
* [x] [PATCH /api/articles/:article_id](localhost:9090/api/articles/:article_id) - This will update the requested article's vote count based on the value included in the body. For example `{ inc_votes: 5 }` would increase the specified article's vote count by 5, and to decrease the vote count by 5 with the following: `{ inc_votes: -5}`  
* [x] [DELETE /api/articles/:article_id](localhost:9090/api/articles/:article_id) - This will delete an article based on the article ID that is requested by the user. For example making a DELETE request to `localhost:9090/api/articles/1` will delete the article with the ID of "1". 
* [x] [GET /api/articles/:article_id/comments](localhost:9090/api/articles/:article_id/comments) - This will return an array of comments for the requested article.
* [x] [POST /api/articles/:article_id/comments](localhost:9090/api/articles/:article-id/comments) - This will add a new comment to the requested article and will serve the posted comment to the user as confirmation for a successful post request.
* [x] [DELETE /api/comments/:comment_id](localhost:9090/api/comments/:comment_id) - This will delete a specified comment that matches ID requested by the user. 
* [x] [PATCH /api/comments/:comment_id](localhost:9090/api/comments:comment_id) - This will update the requested comment's vote count based on the value included in the body. For example `{ inc_votes: 5 }` would increase the specified comment's vote count by 5, and to decrease the vote count by 5 with the following: `{ inc_votes: -5}`  
* [x] [GET /api/users](localhost:9090/api/users) - This will return an array of all user objects that contain information including their username, name and avatar_url.
* [x] [GET /api/users/:username](localhost:9090/api/users/:username) - This will return a single object containing information that matches the username passed in by the user. 