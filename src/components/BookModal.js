import React, { useState, useEffect, useRef } from "react";
import styles from "../components/styles.module.scss";

const BookModal = ({ isOpen, onClose, onAdd, onEdit, book }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [status, setStatus] = useState("Red");
    const titleInputRef = useRef(null);

    useEffect(() => {
        if (book) {
            setTitle(book.title || "");
            setAuthor(book.author || "");
            setGenre(book.genre || "");
            setIsFavorite(book.isFavorite || false);
            setStatus(book.status || "Red");
        }
    }, [book]);

    const handleAddEditBook = (e) => {
        e.preventDefault();

        // Validation for title, author, and genre
        const trimmedTitle = title.trim();
        const trimmedAuthor = author.trim();
        const trimmedGenre = genre.trim();

        if (trimmedTitle.length < 3 || trimmedAuthor.length < 3 || trimmedGenre.length < 3) {
            alert("Each field (title, author, genre) must have at least 3 letters.");
            return;
        }

        // Protection against code injections
        const sanitizedTitle = trimmedTitle.replace(/<[^>]*>?/gm, '');
        const sanitizedAuthor = trimmedAuthor.replace(/<[^>]*>?/gm, '');
        const sanitizedGenre = trimmedGenre.replace(/<[^>]*>?/gm, '');

        if (book) {
            onEdit({ id: book.id, title: sanitizedTitle, author: sanitizedAuthor, genre: sanitizedGenre, isFavorite, status });
        } else {
            onAdd({ title: sanitizedTitle, author: sanitizedAuthor, genre: sanitizedGenre, isFavorite, status });
        }

        handleModalClose();
    };
    const resetForm = () => {
        setTitle("");
        setAuthor("");
        setGenre("");
        setIsFavorite(false);
        setStatus("Red");
    }
    const handleModalClose = () => {
        resetForm();
        onClose();
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleAuthorChange = (e) => {
        setAuthor(e.target.value);
    };

    const handleGenreChange = (e) => {
        setGenre(e.target.value);
    };

    const handleFavoriteChange = (e) => {
        setIsFavorite(e.target.checked);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <div className={`${styles["modal"]} ${isOpen ? styles["show"] : ""}`}>
            <div className={styles["modal-content"]}>
        <span className={styles["close"]} onClick={handleModalClose}>
          &times;
        </span>
                <h2>{book ? "Edit Book" : "Add New Book"}</h2>
                <form onSubmit={handleAddEditBook}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            ref={titleInputRef}
                            placeholder="Enter title"
                            autoFocus
                            required
                            className={styles["input-text"]}
                        />
                    </div>
                    <div>
                        <label>Author:</label>
                        <input
                            type="text"
                            value={author}
                            onChange={handleAuthorChange}
                            placeholder="Enter author"
                            required
                            className={styles["input-text"]}
                        />
                    </div>
                    <div>
                        <label>Genre:</label>
                        <input
                            type="text"
                            value={genre}
                            onChange={handleGenreChange}
                            placeholder="Enter genre"
                            required
                            className={styles["input-text"]}
                        />
                    </div>
                    <div>
                        <label>
                            Favorite:
                            <input
                                type="checkbox"
                                checked={isFavorite}
                                onChange={handleFavoriteChange}
                                className={styles["input-checkbox"]}
                            />
                        </label>
                    </div>
                    <div>
                        <label>Status:</label>
                        <select value={status} onChange={handleStatusChange} className={styles["input-select"]}>
                            <option value="Red">Red</option>
                            <option value="Reading">Reading</option>
                            <option value="Left aside">Left aside</option>
                        </select>
                    </div>
                    <button type="submit" className={styles["button"]}>{book ? "Edit" : "Add"} Book</button>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
