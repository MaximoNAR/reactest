import React, { useState } from "react";
import instance from "../connection_api";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    instance
      .post("/login", values)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Ingresar email"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Ingresar contraseña"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <br />
        <button onClick={handleSubmit}>Ingresar</button>
      </form>
    </>
  );
};

export default Login;
