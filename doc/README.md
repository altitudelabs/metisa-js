# Metisa JavaScript SDK

Metisa JavaScript SDK will help you easily integrate with Metisa in browser or Node.js (coming soon) environment.

Before installation, you can click [here](https://askmetisa.com/docs/integrations/custom-ecommerce.html) to learn more about the prerequisites and concepts of our **Custom Integration** for e-commerce platforms.


## Installation

For a guided installation tutorial for your app:
* [Custom E-Commerce store](https://askmetisa.com/docs/integrations/custom-ecommerce.html)
* [Custom Media app (eg. Spotify or movie recommendations app)](https://askmetisa.com/docs/integrations/custom-media-app.html)

Below we go through the bare necessities to get set up with Metisa on your website.

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
<script src="http://metisa-sdk.s3-ap-southeast-1.amazonaws.com/js/v0.0/metisa.js"></script>
```
<br />
Hack away!

```html
<!-- Embed recommendation widget -->
<div class="mt-widget" data-widget-id="{{ your_widget_id }}"></div>

<!-- Init metisa.js script -->
<script>
  mt('slug', '{{ your_metisa_account_slug }}');
</script>
```
