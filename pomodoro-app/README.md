### Serverless KendoReact Pomodoro Timer

Simple Pomodoro Timer app made using Serverless Framework and KendoUI for React.

##### Setup:

1. Install dependencies:

```sh
cd frontend
npm install
cd ../backend
npm install
```

2. Deploy the backend
```sh
# inside `backend` directory
npm run deploy # or serverless deploy
```

_Note: This must be performed BEFORE running anything frontend related because this step generated `stack.json` file which tells frontend URL of our API Gateway._


3. Run frontend application
```sh
# inside `frontend` directory
npm start
```

And goto [http://localhost:3000](http://localhost:3000)



##### Explanation
Project is divided into two logical parts: frontend and the backend. Backend was created using Serverless Framework (`serverless create -t aws-nodejs`), frontend using popular toolkit called `create-react-app` (`npx create-react-app frontend`).

File `serverless.yml` contains definition of Serverless infrastructure, in this case two functions: one for fetching all the records from DB and second one for posting results into db. You can find the code for these functions inside `handler.js` file. There's also a DynamoDB table described in `Resources` section. The only special thing about this table that it's indexed on `name` field.

Frontend part consists only of two components:
- `<App/>` which is the main one. It handles communication with the backend using HTTP requests and renders data fetched from it. 
- `<Timer /> which is self explanatory, it is meant to measure the time

