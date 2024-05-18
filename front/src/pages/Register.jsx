import styles from "./Register.module.css";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useUser } from "../contexts/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { BiShowAlt } from "react-icons/bi";
import { BiHide } from "react-icons/bi";

const BASE_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

function Register() {
  const { registerUser, isAuthenticated } = useUser();
  const [hidden, setHidden] = useState(true);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required(),
    password: yup.string().required().min(6).max(20),
    email: yup
      .string()
      .required()
      .email()
      .test(
        "is-email-unique",
        "Email is already in use !",
        async function (value) {
          console.log(value);
          try {
            const res = await fetch(`${BASE_URL}/api/checkEmail`, {
              method: "POST",
              body: JSON.stringify({ email: value }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            console.log(data);
            if (data.inUse === true) return false;
            if (data.inUse === false) return true;
          } catch (error) {
            console.log("Error:", error);
          }
        }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(isValid);
  console.log(errors);

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  function handleHidden() {
    setHidden((hide) => !hide);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <>
      <div className={styles.registerContainer}>
        <NavBar />
        <div className={styles.registerBox}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input
              id="name"
              type="text"
              placeholder="First Name"
              {...register("name")}
            />
            <p>{errors.name?.message}</p>

            <input
              id="mail"
              type="text"
              placeholder="Email"
              {...register("email")}
            />
            <p>{errors.email?.message}</p>

            {/* <input
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address",
                },
              })}
              id="mail"
              type="text"
              placeholder="Email"
            />
            <p>{errors.email?.message}</p> */}

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

            {isValid && (
              <>
                <p> Congratulations! Your inputs are valid</p>
                <IoIosCheckmarkCircle
                  style={{
                    fontSize: "3rem",
                    color: "var(--color-buttons--green)",
                  }}
                />
              </>
            )}

            <div className={styles.subBtn}>
              <Button className={styles.subBtn} type="back">
                SUBMIT
              </Button>
            </div>
          </form>
          <Link to="/login" className={styles.regLink}>
            Already have a user? Log in.
          </Link>
        </div>
      </div>
    </>
  );
}

export default Register;
