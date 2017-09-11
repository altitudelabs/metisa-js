var MetisaCore = require('../core');
var withIFrame = require('./withIFrame');
var util = require('../../util');
var compose = util.compose;

class MetisaDom extends compose(MetisaCore)(withIFrame) {
  constructor(opts) {
    if ($ == null) { return console.warn('Metisa Dom requires jQuery to be available!')}
    super(opts);

    console.log(`initialised Metisa Dom with ${JSON.stringify(this.opts)}!`);
    this.renderWidget = this.renderWidget.bind(this);

    this.attachRegisterOptionsToWindow();
  }

  attachRegisterOptionsToWindow() {
    window.mt = this.registerOptions.bind(this);
  }

  tryStart() {
    this.renderWidget();
    this.customIntegration();
  }

  renderWidget() {
    var self = this,
        widgets = $('.mt-widget');

    // Convert widgets nodelist to true array
    widgets = $.makeArray(widgets);

    widgets.forEach(function(widget) {
      // Render widget using Ajax so we can gracefully degrade if there is no content available
      var widgetId = widget.dataset.widgetId,
          customerId = widget.dataset.customerId,
          productId = widget.dataset.productId,
          categoryName = widget.dataset.categoryName,
          brandname = widget.dataset.brandname,
          sessionId = widget.dataset.sessionId,
          language = widget.dataset.language,
          xmlhttp = new XMLHttpRequest(),
          url = this.opts.baseUrl + this.slug + '/api/v1/widget-customer?widget_id=' + widgetId;

      // Override customer, category or brand
      if (customerId) this.customerId = customerId;
      if (productId) this.productId = productId;
      if (categoryName) this.categoryName = categoryName;
      if (brandname) this.brandname = brandname;
      if (sessionId) this.sessionId = sessionId;
      if (language) this.language = language;


      if (this.customerId) {
          url += '&customer_id=' + escape(this.customerId);
      }

      if (this.productId) {
          url += '&product_id=' + escape(this.productId);
      }

      if (this.categoryName) {
          url += '&category_name=' + escape(this.categoryName);
      }

      if (this.brandname) {
          url += '&brandname=' + escape(this.brandname);
      }

      if (this.gender) {
          url += '&gender=' + escape(this.gender);
      }

      if (this.sessionId) {
          url += '&session_id=' + escape(this.sessionId);
      }

      if (this.language) {
          url += '&language=' + escape(this.language);
      }

      url += '&format=html';
      // Prepare iframe
      var iframe = self.createIFrameWithId(widgetId);

      widget.appendChild(iframe);

      // Render loader
      var html = self.getLoaderHTML();

      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html);
      iframe.contentWindow.document.close();

      $.ajax({
          type: "GET",
          url: url,
      })
      .done(function(data, statusText, xhr){
          // Delete loader iframe
          var oldIFrame = document.getElementById('widget-' +
          widgetId);

          var iframeParent = oldIFrame.parentNode;

          if (iframeParent) {
              while (iframeParent.firstChild) {
                  iframeParent.removeChild(iframeParent.firstChild);
              }
          }

          // Create a new iframe for widget
          var iframe = self.createIFrameWithId(widgetId);
          if (xhr.status === 200) {
              widget.appendChild(iframe);

              var html = self.decodeHtmlEntities(data);

              if (html) {
                  iframe.contentWindow.document.open();
                  iframe.contentWindow.document.write(html);
                  iframe.contentWindow.document.close();

                  iframe.parentNode.style.marginBottom = '30px';
              } else {
                  // Html will be empty if store has run out of free sales credits.
                  // Gracefully fail to load widget by removing the iframe from DOM.
                  iframe.parentNode.removeChild(iframe);
              }
          } else {
              console.log('Error: ' + statusText);
              // Remove iframe from DOM
              iframe.parentNode.removeChild(iframe);
          }
      });
    }.bind(this));
  }

  customIntegration() {
    if (this.tokenId) {
      if (this.product) {
        // Update product
        // $.get(this.baseUrl+this.productEndpoint)
        // .done(function(data) {
        //     console.log(data);
        // });
      }
      else if (this.order) {
        var token = this.tokenId;
        // Submit order
        $.ajaxSetup({
          beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", token);
          }
        });
        $.ajax({
          type: "POST",
          url: this.baseUrl + this.orderEndpoint,
          data: JSON.stringify(this.order),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (msg) {
            console.log(msg);
          },
          error: function (errormessage) {
           console.log(errormessage);
          }
        });
      }
    }
  }

  log() {
    if (this.debug) {
      console.log.apply(window, arguments);
    }
  }
}

module.exports = MetisaDom;