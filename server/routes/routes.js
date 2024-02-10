import { Router } from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";


const LocalStrategy = Strategy;
const router = Router();

passport.use(
  new LocalStrategy(async function (email, password, done) {
    pool.query(
      `SELECT * FROM meta_stock_user WHERE email = ?`,
      [email],
      async function (error, results) {
        if (error) {
          console.error("Error en la consulta:", error);
          return done(error);
        }

        const datos_user = results[0];
        if (!datos_user) {
          session.userStatus = "El usuario no existe";
          return done(null, false, { message: "El usuario no existe" });
        } else {
          if (datos_user.active === 1) {
            const match = await verifyPass(datos_user, password);
            if (!match) {
              if (!session.contador) {
                session.contador = 1;
                session.userStatus = "Contraseña incorrecta";
                return done(null, false, { message: "Contraseña incorrecta" });
              } else {
                session.userStatus = "Contraseña incorrecta";
                session.contador++;
                if (session.contador >= 8) {
                  try {
                    pool.query(
                      `UPDATE meta_stock_user SET active = 0 WHERE email = ?`,
                      [email],
                      function (error) {
                        if (error) {
                          console.error(
                            "Error al actualizar el usuario:",
                            error
                          );
                          res.redirect(`/login`);
                        }
                        session.contador = 0;
                      }
                    );
                  } catch (error) {
                    console.error("Error al ejecutar la consulta:", error);
                    res.redirect(`/login`);
                  }
                }
                return done(null, false, { message: "USUARIO BLOQUEADO" });
              }
            }
          } else {
            // User bloqueado, testear un redirect para avisar al usuario que su cuenta ha sido bloqueada.
            session.userStatus = "USUARIO BLOQUEADO";
            return done(null, false);
          }
        }
        session.userStatus = null;
        session.contador = null;
        return done(null, datos_user);
      }
    );
  })
);

passport.serializeUser((usuario, done) => {
  done(null, usuario.id_user);
});

async function getUserByIdUser(idUser) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM meta_stock_user WHERE id_user = ?",
      [idUser],
      function (error, results) {
        if (error) {
          console.error("Error en la consulta:", error);
          reject(error);
        } else {
          const user = results[0];
          resolve(user);
        }
      }
    );
  });
}

passport.deserializeUser(async (idUser, done) => {
  try {
    const user = await getUserByIdUser(idUser);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

router.use(passport.initialize());
router.use(passport.session());

export async function generateHashPassword(password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

export async function verifyPass(usuario, password) {
  const match = await bcrypt.compare(password, usuario.password);
  return match;
}

router.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

async function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/session_expired");
  }
}

router.get("/login", async (req, res) => {
  const user = await datosDeLogin(req, res);
  let usuario;
  if (user) {
    usuario = user.id_user;
  }
  let status = session.userStatus;
  session.userStatus = null;
  res.json(user);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        message: "User authenticated",
        user: req.user,
      });
    });
  })(req, res, next);
});




export default router;

