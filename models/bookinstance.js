const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: "Book", required: true},
    imprint: {type: String, required: true},
    due_back: {type: Date, default: Date.now},
    status: {
        type: String,
        enum: ["Available", "Loaned", "Reserved", "Maintenance"],
        default: "Maintenance",
        required: true
    }
});

BookInstanceSchema.virtual("url").get(function () {
    return `/catalog/bookinstance/${this._id}`;
});

module.exports = mongoose.model("BookInstance", BookInstanceSchema);