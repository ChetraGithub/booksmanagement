// VARIABLES ==================================================
const express = require('express');
const app = express();
const fs = require('fs');
const DATABASE = 'data.json';
const PORT = 3000;
const cors = require('cors');
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

let books = JSON.parse(fs.readFileSync(DATABASE));

// FUNCTIONS ==================================================
let saveBooks = () => {
    fs.writeFileSync(DATABASE, JSON.stringify(books));
};

let getBooksByTitle = (title) => {
    let getBooks = [];
    for (let book of books) {
        if(book.title.toLowerCase().includes(title)) {
            getBooks.push(book);
        }
    };
    return getBooks;
}

// ROUTINGS ===================================================
// GET all books
app.get('/books', (req, res) => {
    res.status(200).send({ books: books, message: 'Get books are successfully.' });
});

// GET book by ID
app.get('/books/:bookID', (req, res) => {
    let id = parseInt(req.params.bookID);
    let index = books.findIndex(book => book.id === id);
    if (books[index]) {
        res.status(200).send({ book: books[index], message: 'Get a book is successfully.'});
    } else {
        res.status(404).send({message: 'ID not found.'});
    }
});

// SEARCH books by title
app.get('/searchBooks', (req, res) => {
    // Note: search books need to use query to make easily (not params)
    let title = req.query.title.toLowerCase();
    let getBooks = getBooksByTitle(title);
    res.status(200).send({ search_books: getBooks, message: 'Search books are successfully.' });
});

// CREATE new book
app.post('/books', (req, res) => {
    let index = (books.length > 0)? books[books.length - 1].id +1 : 1;
    let book = {
        id: index,
        title: req.body.title
    }
    
    books.push(book);
    saveBooks();
    res.status(200).send({ message: 'Create book is successfully.' });
});

// DELETE book by ID
app.delete('/books/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let index = books.findIndex(book => book.id === id);
    if (books[index]) {
        books.splice(index, 1);
        saveBooks();
        res.status(200).send({message: 'Delete book is successfully.'});
    } else {
        res.status(404).send({message: 'ID not found.'});
    }
});

// UPDATE book
app.put('/books/:bookID', (req, res) => {
    let id = parseInt(req.params.bookID);
    let index = books.findIndex(book => book.id === id);
    if (books[index]) {
        let newTitle = req.body.title;
        books[index].title = newTitle;
    
        saveBooks();
        res.status(200).send({message: 'Update book is successfully.'});
    } else {
        res.status(404).send({message: 'ID not found.'});
    }
});

// AUTO ======================================================
app.listen(PORT, () => {console.log('app listen to port: ' + PORT)});