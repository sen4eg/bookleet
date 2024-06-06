Demo is available [here](https://bookleet.onrender.com/)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


### Bookleet - A personal library journal in a pocket of your Google Drive

Bookleet is a book journaling system that allows you to track your books, leave a coments and more.
Project is developed as a part of study project for Client Javascript Applications Course at [CTU](cvut.cz) in Prague.

### How to deploy

1. Clone the repository
2. Login to [Google Developer Console](https://console.developers.google.com/) and create a new project, enable google drive api and create credentials for the project, also would need to allow your redirects and origins, for local development is good enough to use `http://localhost:3000` 
3. Make .env file in the root directory and add the following variables
```
REACT_APP_GAPI_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET 
REACT_APP_HOSTNAME=http://localhost:3000 -- for localhost
REACT_APP_GAPI_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
DEBUG_LOG=true
```
3. Run the following commands
```
npm install
npm start
```

### LICENSE

License hereby is granted for those who checked the [License](LICENSE.md) file and agreed on terms.
