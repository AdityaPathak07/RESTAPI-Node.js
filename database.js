const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/KanbanBoard",{
    useUnifiedTopology: true,
        useNewUrlParser: true,
});
const newSchema = new mongoose.Schema({
    "title": String,
    "id": String,
    "stage": Number,
    "email" : String,
    "password" : String
});

const Intern = mongoose.model("Intern", newSchema);

module.exports = Intern;