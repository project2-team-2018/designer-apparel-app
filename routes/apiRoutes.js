var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    //console.log(req.body);
    db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err.errors[0].message);
      res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        admin: req.user.admin
      });
    }
  });

  // Get all items
  app.get("/api/items", function (req, res) {
    db.items.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(function (dbItems) {
      res.json(dbItems);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Get all items
  app.get("/api/items/:id", function (req, res) {
    db.items.findOne({ where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Create a new item
  app.post("/api/item", function (req, res) {
    db.items.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Create a add item to wishlist
  app.post("/api/wishlist", function (req, res) {
    db.wishlists.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err.errors[0].message);
      res.status(422).json(err.errors[0].message);
    });
  });

    // Delete an item by from wishlist
    app.delete("/api/wishlist/:itemId", function (req, res) {
      //console.log(req.user.email);
      db.wishlists.destroy({ where: { items: req.params.itemId,email:req.user.email } }).then(function (dbItem) {
        res.json(dbItem);
      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
    });

  // Delete an item by id
  app.delete("/api/item/:id", function (req, res) {
    db.items.destroy({ where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Get all seasons
  app.get("/api/seasons", function (req, res) {
    db.seasons.findAll({}).then(function (dbItems) {
      res.json(dbItems);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Create a new season
  app.post("/api/season", function (req, res) {
    db.seasons.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Delete an season by id
  app.delete("/api/season/:id", function (req, res) {
    db.seasons.destroy({ where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Get all types
  app.get("/api/types", function (req, res) {
    db.types.findAll({}).then(function (dbItems) {
      res.json(dbItems);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Create a new types
  app.post("/api/types", function (req, res) {
    db.types.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Delete an types by id
  app.delete("/api/types/:id", function (req, res) {
    db.types.destroy({ where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Get all materials
  app.get("/api/materials", function (req, res) {
    db.materials.findAll({}).then(function (dbItems) {
      res.json(dbItems);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  //create Materials
  app.post("/api/material", function (req, res) {
    db.materials.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Delete Materials by ID
  app.delete("/api/materials/:id", function (req, res) {
    db.materials.destroy({ where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // Create a new message
  app.post("/api/message", function (req, res) {
    db.messages.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

};
