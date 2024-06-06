import PageLayout from "../components/PageLayout";
import styles from '../components/styles.module.scss';

const Home = () => {



    return (
        <PageLayout pageTitle={"Importance of libraring books"} mainContent={
            <div>
                <h4>This short video covers why keeping a personal library is important:</h4>

                    <iframe
                        className={styles["video-frame"]}
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
            </div>
        } />
    );
}

export default Home;