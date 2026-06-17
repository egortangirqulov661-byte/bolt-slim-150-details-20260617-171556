document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".mobile-toggle");

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      header.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var posters = Array.prototype.slice.call(document.querySelectorAll(".hero-poster"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var index = 0;

  function setHero(nextIndex) {
    if (!slides.length) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (item, itemIndex) {
      item.classList.toggle("active", itemIndex === index);
    });

    posters.forEach(function (item, itemIndex) {
      item.classList.toggle("active", itemIndex === index);
    });

    dots.forEach(function (item, itemIndex) {
      item.classList.toggle("active", itemIndex === index);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      setHero(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setHero(index + 1);
    }, 5200);
  }

  var filterInput = document.querySelector("#movieFilter");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var activeCategory = "all";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilter() {
    var keyword = normalize(filterInput ? filterInput.value : "");

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-type"),
        card.getAttribute("data-region")
      ].join(" "));

      var categoryMatch = activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
      var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = categoryMatch && keywordMatch ? "" : "none";
    });
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q) {
      filterInput.value = q;
    }

    filterInput.addEventListener("input", applyFilter);
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeCategory = chip.getAttribute("data-filter") || "all";
      chips.forEach(function (item) {
        item.classList.toggle("active", item === chip);
      });
      applyFilter();
    });
  });

  applyFilter();
});
