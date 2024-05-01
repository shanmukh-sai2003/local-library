const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Author = require('../models/author');
const Genre = require('../models/genre');
const {body, validationResult} = require('express-validator');

exports.index = async (req, res) => {
    try {
        const [
            numBooks,
            numBookInstances,
            numAvailableBookInstancs,
            numAuthors,
            numGenres
        ] = await Promise.all([
            Book.countDocuments({}).exec(),
            BookInstance.countDocuments({}).exec(),
            BookInstance.countDocuments({status: "Available"}).exec(),
            Author.countDocuments({}).exec(),
            Genre.countDocuments({}).exec()
        ]);


        res.render('index', {
            book_count: numBooks,
            book_instance_count: numBookInstances,
            book_instance_available_count: numAvailableBookInstancs,
            author_count: numAuthors,
            genre_count: numGenres
        });
    } catch (error) {
        console.log(error);
    }
}

exports.bookList = async (req, res) => {
    try {
        const allBooks = await Book.find({}, "title author").sort({title: 1}).populate("author").exec();
        res.render('book_list', {bookList: allBooks});
    } catch (error) {
        console.log(error);
    }
}

exports.bookDetails = async (req, res) => {
    const bookId = req.params.id
    try {
        const bookDetails = await Book.findById(bookId).populate("author").populate("genre").exec();
        const bookInstances = await BookInstance.find({book: bookId});
        res.render('book_details_page', {bookDetails: bookDetails, bookInstances: bookInstances});
    } catch (error) {
        console.log(error);
    }
}

exports.createGet = async (req, res) => {
    try {
        const [allAuthors, allGenres] = await Promise.all([
            Author.find().sort({family_name: 1}).exec(),
            Genre.find().sort({name: 1}).exec()
        ]);

        res.render('create_book', {allAuthors: allAuthors, allGenres: allGenres, book: {}});
    } catch (error) {
        console.log(error);
    }
}

exports.createPost = [
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }

        next();
    },

    body("title", "Title must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),

    body("author", "Author must not be empty")
    .trim()
    .isLength({min: 1})
    .escape(),

    body("summary", "Summary must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),

    body("isbn", "ISBN must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
    
    body("genre.*").escape(),

    async (req, res) => {
        const errors = validationResult(req);

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });

        console.log(req.body);

        try {
            if(!errors.isEmpty()) {
                const [allAuthors, allGenres] = await Promise.all([
                    Author.find().sort({family_name: 1}).exec(),
                    Genre.find().sort({name: 1}).exec()
                ]);

                for(const genre of allGenres) {
                    if(book.genre.includes(genre._id)) {
                        genre.checked = "true";
                    }
                }

                res.render('create_book', {allAuthors: allAuthors, allGenres: allGenres, book: book, errors: errors.array()});
            }

            await book.save();
            res.redirect(book.url);
        } catch (error) {
            console.log(error);
        }
    }
]