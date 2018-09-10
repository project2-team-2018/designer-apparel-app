
var $seasonName = $("#season-name");
var $seasonsSubmit = $("#seasons-submit");
var $seasonList = $("#season-list");


// The API object contains methods for each kind of request we'll make
var seasonAPI = {
  saveSeason: function (season) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/season",
      data: JSON.stringify(season)
    });
  },
  getSeasons: function () {
    return $.ajax({
      url: "api/seasons",
      type: "GET"
    });
  },
  deleteSeason: function (id) {
    return $.ajax({
      url: "api/season/" + id,
      type: "DELETE"
    });
  }
};

//refresh seasons
var refreshSeasons = function () {
  seasonAPI.getSeasons().then(function (data) {
    var $seasons = data.map(function (season) {
      var $a = $("<a>")
        .text(season.name)
        .attr("href", "/season/" + season.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": season.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("cz-btn float-right season-delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $seasonList.empty();
    $seasonList.append($seasons);
  });
};

//save season
var saveSeason = function (event) {
  event.preventDefault();

  var season = {
    name: $seasonName.val().trim()
  };

  seasonAPI.saveSeason(season).then(function () {
    refreshSeasons();
  });


  if (!(season.name)) {
    alert("You must enter a name!");
    return;
  }
  $seasonName.val("");
};

var deleteSeason = function () {
  var idToDelete = $(this).attr("data-id");

  seasonAPI.deleteSeason(idToDelete).then(function () {
    refreshSeasons();
  });
};

// Add event listeners to the submit and delete buttons
$seasonsSubmit.on("click", saveSeason);
$seasonList.on("click", ".season-delete", deleteSeason);