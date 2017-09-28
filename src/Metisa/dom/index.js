var MetisaCore = require('../core');
var withIFrame = require('./withIFrame');
var util = require('../../util');
var _ = {
  once: require('lodash/once')
};
var compose = util.compose;

/**
 * @private
 * @class
 * @classdesc {@link Metisa} class that composes with {@link composeClass.IFrame}
 * @requires Metisa
 * @requires composeClass
 * @requires getUtil.compose
 */
var MetisawithIFrame = compose(MetisaCore)(withIFrame);

/**
 * @private
 * @class
 * @classdesc Base class for browser environment. This is initialised and exposed to `window.Metisa` when you import through our [example](/#installation).
 * @extends MetisawithIFrame
 */
class MetisaDom extends MetisawithIFrame {
  /**
   * Constructs a new `MetisaDom` with `opts`.
   * @param {Opts} opts Option object to be passed to MetisaDom contructor
   */
  constructor(opts) {
    if ($ == null) {
      return console.warn('Metisa Dom requires jQuery to be available!')
    }
    super(opts);

    console.log(`initialised Metisa Dom with ${JSON.stringify(this.opts)}!`);
    this.renderWidget = this.renderWidget.bind(this);
    this.registerOptions = this.registerOptions.bind(this);

    this.attachRegisterOptionsToWindow();
    this.renderWidget = _.once(this.renderWidget);
  }

  /**
   * Attaches registered options to `window.mt`.
   */
  attachRegisterOptionsToWindow() {
    window.mt = this.registerOptions;
  }

  /**
   * Registers options from `mt('{{ option }}', {{ value }})`and determines whether item or action data should be handled.
   */
  registerOptions() {
    super.registerOptions.apply(this, arguments);

    if (this.isReadyToStart) {
      this.renderWidget();
      if (this.item) {
        this.track('item', this.item);
      }
      else if(this.action) {
        this.track('action', this.action);
      }
    }
  }

  /**
   * Renders Metisa widgets in the browser.
   * Only gets called once
   */
  renderWidget() {
    this.renderWidgetCalled = true;
    var self = this,
        widgets = $('.mt-widget');

    // Convert widgets nodelist to true array
    widgets = $.makeArray(widgets);

    widgets.forEach(function(widget) {
      // Render widget using Ajax so we can gracefully degrade if there is no content available
      var widgetId = widget.dataset.widgetId,
        userId = widget.dataset.userId,
        itemId = widget.dataset.itemId,
        categoryName = widget.dataset.categoryName,
        brandname = widget.dataset.brandname,
        sessionId = widget.dataset.sessionId,
        language = widget.dataset.language,
        url = this.opts.baseUrl + this.slug + '/api/v1/widget-customer?widget_id=' + widgetId;

      // Override user, category or brand
      if (userId) this.userId = userId;
      if (itemId) this.itemId = itemId;
      if (categoryName) this.categoryName = categoryName;
      if (brandname) this.brandname = brandname;
      if (sessionId) this.sessionId = sessionId;
      if (language) this.language = language;

      if (this.userId) {
        url += '&customer_id=' + escape(this.userId);
      }

      if (this.itemId) {
        url += '&product_id=' + escape(this.itemId);
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
      .done(function(data, statusText, xhr) {
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
  /**
   * Starts tracking by submitting item or action data to the API.
   * @param {string} cat Category name of data (allowed values: `"item"`,`"action"`)
   * @param {object} data Object of item or action data
   */

  track(cat, data) {
    console.log('tracking ', cat);
    if (this.slug) {
      if (cat === 'item') {
        this.createOrUpdateItem(data);
      }
      else if (cat === 'action') {
        this.createOrUpdateAction(data);
      }
    }
  }

  /**
   * Creates an item if it does not exist in Metisa or updates the item.
   * @param {Object} itemData [itemData]{@link BROWSER/SCHEMA.html#Item-data} object to be submitted to the item API endpoint
   */
  createOrUpdateItem(data) {
    var url = this.opts.baseUrl + this.slug + this.opts.itemEndpoint;
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      },
      statusCode: {
          500: function(data, statusText, xhr) {
              console.log('Internal server error');
          },
      },
      success: function (data, statusText, xhr) {
          console.log('Success');
      },
      error: function (data, statusText, xhr) {
        console.log('Error: ' + xhr);
        console.log(data.responseJSON);
      }
    });
  }

  /**
   * Creates an action if it does not exist in Metisa or updates the action.
   * @param {Object} actionData [actionData]{@link BROWSER/SCHEMA.html#Action-data} object to be submitted to the action API endpoint
   */
  createOrUpdateAction(data) {
    var url = this.opts.baseUrl + this.slug + this.opts.actionEndpoint;
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      },
      statusCode: {
          500: function(data, statusText, xhr) {
              console.log('Internal server error');
          },
      },
      success: function (data, statusText, xhr) {
          console.log('Success');
      },
      error: function (data, statusText, xhr) {
        console.log('Error: ' + xhr);
        console.log(data.responseJSON);
      }
    });
  }

  /**
   * Writes logs about registered options to browser console when `debug` property of `MetisaDom` object is `true`
   */
  log() {
    if (this.debug) {
      console.log.apply(window, arguments);
    }
  }
}

module.exports = MetisaDom;
