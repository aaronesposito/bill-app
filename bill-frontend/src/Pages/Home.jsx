import scrooge from '../assets/scrooge.jpg'
import styles from '../styles/Home.module.css'


function Home() {


    return(
        <>
            <div className={styles.innerShadowBox}>
                <img className= {styles.homeImage} src={scrooge} />
            </div>
        </>
    )
}

export default Home