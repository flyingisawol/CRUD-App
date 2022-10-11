const express = require("express");
const passport = require("passport");

const User = require("../models/users");

const router = express.Router();

// TO REGISTRATION 
router.get("/register", (req, res) => {
  res.render("register.ejs");
})

// REGISTERING
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.register(
      new User({ username: username }),
      password
    );
    req.login(user, () => {
      res.redirect("/merchants");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
})

// LOGIN CONFIRMATION ?
router.get("/", (req, res) => {
  console.log(req)
  if (req.isAuthenticated()) {
    res.redirect("back");
  } else {
    res.render("home.ejs", {

    });
  }
})

// LOGIN ROUTE
router.post("/", passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/merchants",
    failureFlash: true,
  })
);

// LOGOUT 
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
