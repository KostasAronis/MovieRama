# MovieRama

This is a small and simple social sharing platform where users can share their favorite movies.  
Each movie has a title and a small description as well as a date that corresponds to the date it was added to the database.  
Users can also express their opinion about a movie by either likes or hates .

### Built With

* [Node.js (v16.13)](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Sequelize](https://sequelize.org/)
* [sqlite3](https://www.npmjs.com/package/sqlite3)
* [Liquid.js](https://liquidjs.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

This app can be run either via using _docker_ or directly by running it with _nodejs_.  
All listed commands must be run from the project's root directory

#### Notes
- When first run the project will create & seed it's database with some sample data before starting the application server.  
The database is currently as sqlite file stored under `./db/database.sqlite`. Deleting it will allow for a fresh run.
- The server listens to port 1337 by default.
- The application authorizes the users by using jwt tokens which are stored in a cookie (named `access_token`).


### Running via nodejs
It has only been tested with version 16.12 so this is the suggested version to use.

1. Install dependencies
   * `npm install`
2. Run node server
   * `node index.js`

### Running via docker
1. Build docker image
   * `docker build . -t movierama`
2. Run docker container
   * `docker run -p 1337:1337 -d movierama`

### View the running application
Navigate to `http://localhost:1337`

You can use test user's credentials:
```
email: 'test@user.com'
pass: 'test'
```
or simply create a new user by using the Register form.

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap
This project is a prototype and is by no means a finished product.  
Several features are missing that would allow it to be both more scalable and allow for more quick extension.

- Unit Tests.
- More robust authentication / authorization
  - Use `express-session` or equivelant library.
  - Seperate user roles.
- Seperate front end from controller logic.
- Migration logic.
  - Remove seeding.
- Finetune model attribute datatypes.
- Change voting to use ajax calls.
- Realtime vote value updates ( eg. via socket.io ).

<p align="right">(<a href="#top">back to top</a>)</p>
