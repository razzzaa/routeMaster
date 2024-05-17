import NavBar from "../components/NavBar";
import styles from "./About.module.css";

function About() {
  return (
    <main className={styles.container}>
      <NavBar />
      <section>
        <img src="/aboutThree.jpeg" />
        <div className={styles.box}>
          <h1>About Us.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            repellendus non quae, suscipit quas neque qui perspiciatis
            necessitatibus culpa. Autem molestiae animi nesciunt rem obcaecati
            totam ex voluptas aspernatur commodi.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;
