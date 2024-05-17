import styles from "./Pricing.module.css";
import NavBar from "../components/NavBar";

function Pricing() {
  return (
    <main className={styles.container}>
      <NavBar />

      <section className={styles.sec}>
        <div className={styles.box}>
          <h1>
            Map Your Adventures: Discover Our Pricing Plans Starting from $4.99.
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            repellendus non quae, suscipit quas neque qui perspiciatis
            necessitatibus culpa. Autem molestiae animi nesciunt rem obcaecati
            totam ex voluptas aspernatur commodi.
          </p>
        </div>
        <img src="/pricing.jpg" />
      </section>
    </main>
  );
}

export default Pricing;
