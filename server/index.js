const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.json());
const port = 8000;

app.use(cors());

app.get("/users", (req, res) => {
    return res.json(users);
});

//delete
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
        if (err) return res.status(500).send({ message: "Error writing file" });
        return res.json(filteredUsers);
    });
});

//post
app.post("/users", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "enter all details" });
    }
    let id = Date.now();
    let newUser = { id, name, age, city };
    users.push(newUser);
    fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
        if (err) return res.status(500).send({ message: "Error writing file" });
        return res.json({ message: "user details added successfully", users });
    });
});

//update
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "enter all details" });
    }
    let index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        users[index] = { id, name, age, city };
        fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
            if (err) return res.status(500).send({ message: "Error writing file" });
            return res.json({ message: "user details updated successfully", users });
        });
    } else {
        return res.status(404).send({ message: "User not found" });
    }
});

app.listen(port, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
    } else {
        console.log(`App is running on port ${port}`);
    }
});
