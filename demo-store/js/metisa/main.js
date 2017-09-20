mt('store', 'demo');

var mapMovieToMetisaProduct = function(movie) {
  return {
    id: movie.imdb_id,
    name: movie.title,
    variants: [
      {
        id: movie.imdb_id,
        image_url: movie.image,
        url: 'https://amazingshoes.com/products/nike-running-shoes',
        price: 0
      }
    ]
  }
}

$.get('/js/metisa/products.json')
.then(function(result) {
  result = result.filter(function(movie) { return !!movie.poster && movie.poster.imdb; });
  var metisaProducts = result.map(function(movie) {
    var image = movie.poster.imdb ? movie.poster.imdb.slice('http://ia.media-imdb.com/images/M/'.length) : "";

    return mapMovieToMetisaProduct(
      Object.assign(movie, {
        image: '/img/imdb/' + image
      })
    );
  });
  // metisaProducts.forEach(function(product) {
  //   mt('product', product);
  // });
});