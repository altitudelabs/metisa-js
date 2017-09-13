$.get('./js/metisa/products.json')
.then(function(result) {
  result = result.filter(function(movie) { return !!movie.poster && movie.poster.imdb; });
  result = result.map(function(movie) {
    var image = movie.poster.imdb ? movie.poster.imdb.slice('http://ia.media-imdb.com/images/M/'.length) : "";
    return Object.assign(movie, {
      stars: [
        movie.rating >= 2 ? 'zmdi-star' : movie.rating > 1 ? 'zmdi-star-half' : "",
        movie.rating >= 4 ? 'zmdi-star' : movie.rating > 3 ? 'zmdi-star-half' : "",
        movie.rating >= 6 ? 'zmdi-star' : movie.rating > 5 ? 'zmdi-star-half' : "",
        movie.rating >= 8 ? 'zmdi-star' : movie.rating > 7 ? 'zmdi-star-half' : "",
        movie.rating >= 10 ? 'zmdi-star' : movie.rating > 9 ? 'zmdi-star-half' : ""
      ],
      image: './img/imdb/' + image
    });
  });
  result.sort(function(a, b) {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
  var source = $("#movie-item").html();
  var template = Handlebars.compile(source);
  $('.movie-list').html(result.map(template));

  result.forEach(function(movie) {
    mt('item', mapMovieToMetisaProduct(movie));
  });
});

function mapMovieToMetisaProduct(movie) {
  return {
    id: movie.imdb_id,
    name: movie.title,
    maker: null,
    variants: [
      {
        id: movie.imdb_id,
        image_url: movie.poster.imdb ? movie.poster.imdb.replace('http://ia.media-imdb.com/images/M/', 'https://altitudelabs.github.io/metisa-js/demo-store/img/imdb/') : "",
        name: movie.title,
        url: [
          'https://altitudelabs.github.io/metisa-js/demo-store/single-product#',
          movie.imdb_id
        ].join(''),
        price: 0
      }
    ]
  };
}