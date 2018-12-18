---
some_variable: "jeckyll wont update js without frontmatter.."
---

(function() {


  function hideSpinner() {
    document.getElementById("search-spinner").style.display = "none";
  }

  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');
    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];

        appendString += '<article onclick="openPage(event, \'' + item.url + '\')">';
        appendString += '<a href="' + item.url + '"><img src="' + item.image + '" alt="" class="article-image"><h3 class="major">' + item.title + '</h3></a>';
        appendString += '<p>' + item.date + '</p>';
        appendString += '<a href="' + item.url + '" class="special">Read more</a>';
        appendString += '</article>';

      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<p>No results found</p>';
    }
    hideSpinner()
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  function buildIndexAndSearch(idx, documents) {
      if (documents.length > 0) {
          var document = documents.pop()
          idx.add({
              'id': Object.keys(window.store)[documents.length],
              'title': document.title,
              'category': document.category,
              'content': document.content,
          })
          window.setTimeout(() => {
              buildIndexAndSearch(idx, documents)
          }, 0)
      } else {
          var results = idx.search(searchTerm) // Get lunr to perform a search
          displaySearchResults(results, window.store)
      }
  }


  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box-header').setAttribute("value", searchTerm);
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 100 });
      this.field('category');
      this.field('content');
    });

    var storeArray = Object.values(window.store)
    buildIndexAndSearch(idx, storeArray)

  }
})();