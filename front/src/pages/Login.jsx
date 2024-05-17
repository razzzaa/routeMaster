import styles from "./Login.module.css";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { BiShowAlt } from "react-icons/bi";
import { BiHide } from "react-icons/bi";

function Login() {
  const { isAuthenticated, logIn, error } = useUser();
  const [hidden, setHidden] = useState(true);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    password: yup.string().required().min(6).max(20),
    email: yup.string().required().email(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await logIn(data);
    } catch (error) {
      console.log(error);
    }
  };

  function handleHidden() {
    setHidden((hide) => !hide);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app/user/cities", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <div className={styles.loginContainer}>
      <NavBar />
      <div className={styles.loginBox}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <input
            id="mail"
            type="text"
            placeholder="Email"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>

          <div className={styles.passwordBox}>
            <input
              id="password"
              type={hidden ? "password" : "text"}
              placeholder="Password"
              {...register("password")}
            />
            <span onClick={handleHidden}>
              {hidden ? <BiHide /> : <BiShowAlt />}
            </span>
            <p>{errors.password?.message}</p>
          </div>

          {error && (
            <>
              <p> {error}</p>
              <MdCancel
                style={{
                  fontSize: "3rem",
                  color: "var(--color-buttons--red)",
                }}
              />
            </>
          )}

          <div className={styles.logBtn}>
            <Button className={styles.subBtn} type="back">
              LOGIN
            </Button>
          </div>
        </form>
        <Link to="/register" className={styles.logLink}>
          New to RouteMaster? Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
