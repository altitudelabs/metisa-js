# Metisa JavaScript SDK


Metisa empowers businesses ...

Our JavaScript SDK will help you easily integrate with Metisa in browser or Node.js environment.

Before installation, you can click [here](https://askmetisa.com/docs/integrations/custom-ecommerce.html) to learn more about the prerequisites and concepts of our **Custom Integration** for e-commerce platforms.


## Installation

__In Browser__

Metisa for browser requires v1.5+ [jQuery](https://code.jquery.com/). Please make sure jQuery is available.

Add this to your base template file if your site uses an older version of jQuery or does not use it at all.
> **Note:** adding this code block when your site already loads jQuery has a very slim chance of breaking your site due to differences between versions.

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"
integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
crossorigin="anonymous"></script>
```
<br />
Once jQuery is available, paste the following script to the same file below jQuery. This will load the Metisa script that is needed to send and receive data to/from Metisa.

```html
<script src="http://metisa-sdk.s3-ap-southeast-1.amazonaws.com/js/v0.0/browser.js"></script>
```
<br />
Hack away!

```html
<div class="mt-widget" data-widget-id="1"></div>
<script type="text/javascript">
  mt('slug', 'metisa');

</script>
```

<br />
You can find more about what you can do by reading our [API documentation](./API).
