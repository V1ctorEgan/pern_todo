const express = require('express')
const pg = require('pg')
const cors = require('cors');
const app = express();

const Port = 5000

// MiddleWare
app.use(cors());
app.use(express.json())

//db config
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "pernStack",
    password: "asumiboko",
    port: 5432,
  });
db.connect();
//______________________//ROUTES
//create a todo
app.post("/todos",async (req, res)=>{
    try {
        const {description} = req.body;
        const newTodo = await db.query('INSERT INTO todo (description) VALUES ($1) RETURNING *',[description])
        res.json(newTodo.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})
//get all todo
app.get("/todos",async (req, res)=>{
    try {
        const allTodos = await db.query('SELECT * FROM todo');
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
})
// get a todo
app.get("/todos/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const aTodo = await db.query('SELECT * FROM todo WHERE todo_id = $1',[id]);
        res.json(aTodo.rows[0])
    } catch (err) {
        console.error(err.message);
        
    }
})

//update a todo
app.put('/todos/:id', async (req, res)=>{
    try {
       const {id} = req.params;
       const {description} = req.body;
       const  updateTodo = await db.query('UPDATE todo SET description = $1 WHERE todo_id = $2',[description, id])
       res.json('Todo is sucessfully updated')
    } catch (err) {
        console.error(err.message);
    }
})


//delete a todo
app.delete('/todos/:id', async (req, res)=>{
    try {
        const {id } = req.params;
        const deleteTodo = await db.query('DELETE FROM todo WHERE todo_id = $1',[id])
        res.json('todo was deleted')
    } catch (err) {
        console.error(err.message);
        
    }
})


app.listen(Port, ()=>{
    console.log(`Server running on port ${Port}`)
})
