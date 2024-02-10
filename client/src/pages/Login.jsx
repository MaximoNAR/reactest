import React from "react";
import instance from "../connection_api";

const Login = () => {
  return (
    <>
      <form>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Ingresar usuario"
          />
        </div>
        <br />
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Ingresar contraseña"
          />
        </div>
        <br />
        <button>Ingresar</button>
      </form>
    </>
  );
};

export default Login;
