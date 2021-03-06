var db = require("../models");
// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var Sequelize = require("sequelize");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // Load add items page
  app.get("/items", function (req, res) {
    db.items.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(function (dbItems) {
      //console.log(dbItems);
      if (req.user) {
        res.render("items", {
          title: "Items",
          items: dbItems
        });
      } else {
        res.redirect("/login");
      }

    });
  });

  // Load 
  app.get("/messages", function (req, res) {
    db.messages.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(function (dbItems) {
      //console.log(dbItems);
      if (req.user) {
        res.render("messages", {
          title: "Messages",
          messages: dbItems
        });
      } else {
        res.redirect("/login");
      }

    });
  });

  // Load seasons
  app.get("/seasons", function (req, res) {
    db.seasons.findAll({}).then(function (dbItems) {
      //console.log(dbItems);
      if (req.user) {
        res.render("seasons", {
          title: "Seasons",
          seasons: dbItems
        });
      } else {
        res.redirect("/login");
      }

    });
  });

  //loading materials
  app.get("/materials", function (req, res) {
    db.materials.findAll({}).then(function (dbItems) {
      //console.log(dbItems);
      if (req.user) {
        res.render("materials", {
          title: "Fabrics",
          materials: dbItems
        });
      } else {
        res.redirect("/login");
      }

    });
  });

  app.get("/types", function (req, res) {
    db.types.findAll({}).then(function (dbItems) {
      //console.log(dbItems);
      if (req.user) {
        res.render("types", {
          title: "Types of Silhouette",
          types: dbItems
        });
      } else {
        res.redirect("/login");
      }

    });
  });

  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("signup", {});
    //res.sendFile(path.join(__dirname, "../signup.html"));
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("login", {});
    //    res.sendFile(path.join(__dirname, "../login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function (req, res) {
    //res.sendFile(path.join(__dirname, "../members.html"));
    res.redirect("/all");
  });

  // Load index page
  app.get("/", function (req, res) {
    db.items.findAll().then(function (dbItems) {
      res.render("index", {
        items: dbItems
      });
    });
  });

  // Load admin page
  app.get("/admin", function (req, res) {
    if (req.user) {
      res.render("admin", {});
    } else {
      res.redirect("/login");
    }
  });

  // Load all items page
  app.get("/all", function (req, res) {
    db.items.findAll().then(function (dbItems) {
      res.render("all", {
        items: dbItems
      });
    });
  });

  // Load search text filtered items page
  app.get("/search/:text", function (req, res) {
    db.items.findAll({
      where: {
        $or: [
          { season: req.params.text },
          { type: req.params.text },
          { material: req.params.text },
          { name: { $like: "%" + req.params.text + "%" } },
          { color: { $like: "%" + req.params.text + "%" } },
          { description: { $like: "%" + req.params.text + "%" } }
        ]
      }
    }).then(function (dbItems) {
      res.render("all", {
        items: dbItems
      });
    });
  });

  // Load season filtered items page
  app.get("/season/:season", function (req, res) {
    db.items.findAll({ where: { season: req.params.season } }).then(function (dbItems) {
      res.render("all", {
        items: dbItems
      });
    });
  });

  // Load material filtered items page
  app.get("/material/:materialName", function (req, res) {
    db.items.findAll({ where: { material: req.params.materialName } }).then(function (dbItems) {
      res.render("all", {
        items: dbItems
      });
    });
  });

  app.get("/type/:typeName", function (req, res) {
    db.items.findAll({ where: { type: req.params.typeName } }).then(function (dbItems) {
      res.render("all", {
        items: dbItems
      });
    });
  });

  // Load item page and pass in an item by id
  app.get("/item/:id", function (req, res) {
    db.items.findOne({ where: { id: req.params.id } }).then(function (dbItem) {

      res.render("item", {
        item: dbItem
      });
    });
  });

  // Load message page and pass in an item by id
  app.get("/message/:id", function (req, res) {
    db.items.findOne({ where: { id: req.params.id } }).then(function (dbItem) {

      res.render("message", {
        item: dbItem
      });
    });
  });

  // Like an item pass in an item by id
  app.get("/liked/:id", function (req, res) {
    db.items.update(
      { likes: Sequelize.literal('likes + 1') },
      { where: { id: req.params.id } }).then(
        function (result) {
          if (result.changedRows == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
          } else {
            res.status(200).end();
          }
        });
  });

  // Unlike an item, pass in an item by id
  app.get("/unliked/:id", function (req, res) {
    db.items.update(
      { likes: Sequelize.literal('likes - 1') },
      { where: { id: req.params.id } }).then(
        function (result) {
          if (result.changedRows == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
          } else {
            res.status(200).end();
          }
        });
  });

  // Load wishlist page
  app.get("/wishlist", isAuthenticated, function (req, res) {
    if (req.user) {
      db.wishlists.findAll({
        attributes: [
          'email',
          [Sequelize.fn('GROUP_CONCAT', Sequelize.col('items')), 'items']
        ],
        where: { email: req.user.email }
      }).map(function (element) {
        if(element.get('items')!=null){
          var items = element.get('items').split(",");
          //console.log(items);
          db.items.findAll({ where: { id: { $in: items } } })
            .then(function (ItemsdbItem) {
              res.render("wishlist", {
                items: ItemsdbItem
              });
            });
        }else{
          res.render("wishlist",{});
        }
      });
    } else {
      res.redirect("/login");
    }
  });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
