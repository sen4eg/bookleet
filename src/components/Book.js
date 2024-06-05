
const Book = ({ book }) => {
    const bookData = book._data;


    return (
        bookData &&
        <div>
            <h3>{bookData.title}</h3>
            <p>Author: {bookData.author}</p>
            <p>Genre: {bookData.genre}</p>
            <p>Status: {bookData.status}</p>
            <p>Favorite: {bookData.favorite ? "☆" : " "}</p>
        </div>
    );
}

export default Book;