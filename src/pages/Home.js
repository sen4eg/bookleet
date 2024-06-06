

import PageLayout from "../components/PageLayout";
import styles from "../components/styles.module.scss";
import {Entity} from "../core/data/Entities";
import {useEffect, useState} from "react";
import {useData} from "../core/RXdbProvider";
import Book from "../components/Book";

const Home = () => {
    const { database, syncStatus} = useData();
    const [books, setBooks] = useState([]);


    useEffect(() => {
        if (!database || books.length !== 0) return;
        const fetchBooks = async () => {
            Entity.findAll(database, 'books').then((books) => {
                setBooks(books.sort((a, b) => +new Date(b._data.timestamp) - new Date(a._data.timestamp)).slice(0,2));
            });
        }
        fetchBooks().then();
    }, [database, syncStatus, books]);

    return (
    <PageLayout pageTitle={"Home page"} mainContent={
        <div style={styles["home-page-container"]}>
            <h4>Recent books:</h4>
            {books.map(book => (
                <Book  key={book?._data?.id} book = {book}
                />
            ))}
        </div>
    }/>
  );
}

export default Home;
