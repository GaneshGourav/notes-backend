const express = require("express");
const cors = require("cors");

const { connection } = require("./db");
const { userRouter } = require("./routes/userRoutes");
const { noteRouter } = require("./routes/noteRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users",userRouter)
app.use("/notes",noteRouter)


app.get("/",(req,res)=>{
    res.send("This is the home page")
})


app.listen(7700,async()=>{
    try {
        await connection;
        console.log("Connected to the DB");
        console.log("server is running");
    } catch (error) {
        console.log(error);
    }
})