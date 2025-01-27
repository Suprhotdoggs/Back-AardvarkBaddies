// En postman se usa "localhost:3000"
//instalar npm i pg
import express from "express"; // hacer npm i express
import cors from "cors"; // hacer npm i cors
import user from "./controller/user-controller.js"
import people from "./controller/people-controller.js"
const app = express();
const port = 3000;

app.use(cors());  
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/user', user)
app.use('/people', people)


app.listen (port, () => {
    console.log(`Example app listening on port ${port}`)
})