(function () {
  'use strict';

  function loadMarkdown (path) {
    return fetch(path).then(function (pages) {
      return pages.text();
    }).then(function (pages) {
      return new Promise(function (resolve, reject) {
        marked(pages, function (error, formatted) {
          if (!error) {
            resolve(formatted);
          } else {
            reject(error);
          }
        });
      });
    }).then(function (formatted) {
      var pages = document.createDocumentFragment();
      var currentSlide = null;
      var currentID = 0;
      _.each($.parseHTML(formatted), function (node) {
        if (node.nodeName === '#text') {
          return;
        }
        if (node.nodeName === 'H1') {
          // as title
          if (currentSlide) {
            pages.appendChild(currentSlide.get());
          }
          currentSlide = new SlideFragment(++currentID, node);
          return;
        }
        if (!currentSlide) {
          console.warn('ouch');
          return;
        }
        // as content
        currentSlide.add(node);
      });
      if (currentSlide) {
        pages.appendChild(currentSlide.get());
      }
      var codeBlocks = pages.querySelectorAll('pre > code');
      Array.prototype.forEach.call(codeBlocks, (node) => {
        hljs.highlightBlock(node);
      });

      var content = document.querySelector('#content');
      content.appendChild(pages);
      return ++currentID;
    });
  }


  function SlideFragment (id, title) {
    var html = SlideFragment._tpl({
      id: id,
    });
    this._element = $.parseHTML(html)[0];
    this._head = $(this._element).find('.head');
    this._body = $(this._element).find('.body');
    this._head.append(title);
  }

  SlideFragment._tpl = _.template(`<div id="slide-<%= id %>" class="slide">
    <div class="head"></div>
    <div class="body"></div>
  </div>`);

  SlideFragment.prototype.add = function (element) {
    this._body.append(element);
  };

  SlideFragment.prototype.get = function () {
    return this._element;
  };


  function SlideController (nSlides) {
    if (!SlideController._instance) {
      SlideController._instance = this;
      this._currentID = 0;
      this._nSlides = nSlides;

      var h = location.hash;
      if (!h) {
        h = 1;
      } else {
        h = parseInt(h.substr(1), 10);
      }
      this.goTo(h);

      $(document).on('keypress', function (event) {
        var sc = SlideController();
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === ' ') {
          event.preventDefault();
          sc.next();
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          sc.previous();
        } else {
        }
      });
    }
    return SlideController._instance;
  }
  SlideController._instance = null;

  SlideController.prototype.currentID = function () {
    return this._currentID;
  };

  SlideController.prototype.next = function () {
    this.goTo(this._currentID + 1);
    return this;
  };

  SlideController.prototype.previous = function () {
    this.goTo(this._currentID - 1);
    return this;
  };

  SlideController.prototype.begin = function () {
    this.goTo(1);
  };

  SlideController.prototype.end = function () {
    this.goTo(this._nSlides - 1);
  };

  SlideController.prototype.goTo = function (id) {
    if (id >= this._nSlides || id <= 0) {
      return;
    }
    // hide previous slide
    $('div.slide.active').removeClass('active');
    var $slide = $('#slide-' + id);
    $slide.addClass('active');
    this._currentID = id;
    location.hash = '#' + id;
    return this;
  };


  function main () {
    if (!window.fetch) {
      alert('minimal version requirement: Firefox 39, Chrome 42, Opera 29');
      return;
    }
    loadMarkdown('./pages.md').then(function (nSlides) {
      return new SlideController(nSlides);
    });
  }


  main();
})();
