import scrooge from '../assets/scrooge.jpg'
import styles from '../styles/Home.module.css'
import { API_BASE_URL } from '../Config/apiConfig/';



function Home() {

    console.log('API_BASE_URL at runtime:', API_BASE_URL);
    return(
        <>
            <div className={styles.innerShadowBox}>
                <img className= {styles.homeImage} src={scrooge} />
            </div>
        </>
    )
}

export default Home