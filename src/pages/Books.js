import PageLayout from "../components/PageLayout";
import styles from "../components/styles.module.scss";
import {useEffect, useState} from "react";
import AddButton from "../components/AddButton";
import Book from "../components/Book";
import BookModal from "../components/BookModal";
import {Entity, Book as BookCl} from "../core/data/Entities";
import {useData} from "../core/RXdbProvider";

const Books = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedBook, setSelectedBook] = useState(null);

    const { database, syncStatus } = useData();

    const [books, setBooks] = useState([
        // Your list of books goes here
        // Example: { id: 1, title: "Book 1" }
    ]);

    // Function to add a new book
    const addBook = (book) => {
        if (!book && !database) return;
        const bookObj = new BookCl(book);
        console.log("bookObj", bookObj);
        bookObj.persist(database).then(() => {
            fetchBooks().then();
            closeModal();
        });
    };

    const editBook = (book) => {
        if (!book && !database) return;
        const bookObj = new BookCl(book);
        bookObj.update(database).then(() => {
            fetchBooks();
            closeModal();
        });
    }

    const deleteBook = (book) => {
        const bookObj = new BookCl(book);
        bookObj?.delete(database).then(() => {
            fetchBooks();
        });
    }

    const closeModal = () => {
        setSelectedBook(null);
        setIsModalOpen(false);
    }

    const openModal = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    }

    const fetchBooks = async () => {
        Entity.findAll(database, 'books').then((books) => {
            setBooks(books.sort((a, b) => +new Date(b._data.timestamp) - new Date(a._data.timestamp)));
            console.log("books", books);
        });
    }

    useEffect(() => {
        if (!database) return;
        console.log("fetching books");
        fetchBooks();

    }, [database, syncStatus]);

    return (
        <PageLayout pageTitle="My Books" mainContent={
            <>
            <div className={styles['books-area']}>
                <div className={styles['search-container']}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <AddButton onClick = {()=>openModal(null)}/>
                </div>
                <div className={styles['list-container']}>
                    {books.map(book => (
                        <Book  key={book?._data?.id} book = {book}
                               onDelete = {()=>deleteBook(book)}
                                 onEdit = {()=>openModal(book)}
                        />
                    ))}
                </div>
            </div>
                <BookModal isOpen={isModalOpen} onClose={closeModal} onAdd={addBook} onEdit={editBook} book={selectedBook}/>
            </>
        } />
    );
}

export default Books;