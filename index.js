const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser : true}).then(()=>{
    console.log('connected');
    app.listen(3000, () => console.log("Server Up and running"));
})

app.set("view engine", "ejs");

// GET METHOD

app.get("/", (req, res) => {
    TodoTask.find({}).then((tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    }).catch((error) => console.log(error));
});


app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}).then((tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        }).catch((error) => console.log(error));
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }).then((err) => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

    //DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndDelete(id).then((err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });