const express = require("express");
const passport = require("passport");

const User = require("../models/users");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.register(
      new User({ username: username }),
      password
    );
    req.login(user, () => {
      res.redirect("/lnmerch");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("back");
  } else {
    res.render("login.ejs");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/lnmerch",
    failureFlash: true,
  })
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
