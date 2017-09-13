# Metisa Javascript SDK


Metisa empowers businesses ...

Javascript SDK will help you easily integrate with Metisa in browser or nodejs environment.


## Installation

__In Browser__

Metisa for browser requires v1.5+ [jQuery](https://code.jquery.com/). Please make sure jQuery is available.

For example
```
<script src="https://code.jquery.com/jquery-3.2.1.min.js"
integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
crossorigin="anonymous"></script>
```

Once jQuery is available, paste the following script to your site. This will load Metisa SDK from our s3 bucket.

```
<script src="https://metisa-sdk.s3-ap-southeast-1.amazonaws.com/js/v0.0/browser.js"></script>
```

Hack away!

```html
<div class="mt-widget" data-widget-id="1"></div>
<script type="text/javascript">
  mt('store', 'metisa');
  mt('store', 'metisa');

  /*$('.my-product').on('click', function() {
    mt('action', {
      tag: ''
    })
  });*/
</script>
```

<br />
You can find more about what you can do by reading our [API documentation](./API)
