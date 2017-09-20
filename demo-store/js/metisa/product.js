$.get('./js/metisa/products.json')
.then(function(result) {
  var imdbId = location.hash.slice(1);
  var movie = result.find(function(r) { return r.imdb_id === imdbId; });
  if (!movie) {
    alert('Could not find the movie with id ' + imdbId + ' . Please try again');
    history.back();
    return;
  }
  var image = movie.poster.imdb ? movie.poster.imdb.slice('http://ia.media-imdb.com/images/M/'.length) : "";
  movie = Object.assign(movie, {
    image: './img/imdb/' + image
  });

  var source = $("#movie-detail").html();
  var template = Handlebars.compile(source);
  $('.single-product').html(template(movie));

  $('.get-ticket').on('click', function() {
    alert('thank you for purchasing!');
  });

  var mapMovieToMetisaProduct = function(movie) {
    return {
      id: movie.imdb_id,
      name: movie.title,
      variants: [
        {
          id: movie.imdb_id,
          image_url: movie.image,
          url: [
            'https://altitudelabs.github.io/metisa-js/demo-store/single-product#',
            movie.imdb_id
          ].join(''),
          price: 0
        }
      ]
    }
  }

  mt('product', mapMovieToMetisaProduct(movie));
});