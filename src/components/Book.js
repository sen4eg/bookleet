import React from 'react';
import styles from './styles.module.scss';

const Book = ({ book, onEdit, onDelete }) => {
    const bookData = book._data;

    return (
        bookData &&
        <div className={styles['book-container']}>
            <h3 className={styles['book-title']}>{bookData.title}</h3>
            <p className={styles['book-author']}>Author: {bookData.author}</p>
            <p className={styles['book-genre']}>Genre: {bookData.genre}</p>
            <p className={styles['book-status']}>Status: {bookData.status}</p>
            <p className={styles['book-favorite']}>{bookData.isFavorite ? "☆" : " "}</p>
            {!!onDelete && (<div className={styles['button-group']}>
                <button className={styles['edit-button']} onClick={() => onEdit(book)}>Edit</button>
                <button className={styles['delete-button']} onClick={() => onDelete(book)}>Delete</button>
            </div>)}
        </div>
    );
}

export default Book;