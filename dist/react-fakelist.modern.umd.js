(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-resize-detector')) :
  typeof define === 'function' && define.amd ? define(['react', 'react-resize-detector'], factory) :
  (global = global || self, global.reactFakelist = factory(global.react, global.reactResizeDetector));
}(this, (function (React, reactResizeDetector) {
  React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var isFunction = function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  var BodyElement = {
    addEventListener: function addEventListener(type, cllbck) {
      window.addEventListener(type, cllbck);
    },
    removeEventListener: function removeEventListener(type, cllbck) {
      window.removeEventListener(type, cllbck);
    },
    __str__: 'Body Element'
  };
  Object.defineProperties(BodyElement, {
    'scrollTop': {
      get: function get() {
        return window.scrollY;
      }
    },
    'clientHeight': {
      get: function get() {
        return document.documentElement.clientHeight;
      }
    }
  });
  var BODY_REF = {
    current: BodyElement
  };

  var TRUTHY = function TRUTHY() {
    return true;
  };

  var DEFAULT_OPTIONS = {
    id: 'fake-list',
    approximateElementHeight: 80,
    overhead: 3,
    assumeHeightIsConstant: true
  };
  function useFakeList(datas, scrollerRef, renderElement, options, validateItem) {
    if (datas === void 0) {
      datas = [];
    }

    if (scrollerRef === void 0) {
      scrollerRef = BODY_REF;
    }

    if (options === void 0) {
      options = DEFAULT_OPTIONS;
    }

    if (validateItem === void 0) {
      validateItem = TRUTHY;
    }

    var _React$useState = React.useState([]),
        dataItems = _React$useState[0],
        setDataItems = _React$useState[1];

    var _React$useState2 = React.useState(0),
        refresh = _React$useState2[0],
        setRefresh = _React$useState2[1];

    var _React$useState3 = React.useState(_extends({}, DEFAULT_OPTIONS, options)),
        config = _React$useState3[0];

    var sizes = React.useRef([]);
    var setItemHeight = React.useCallback(function (i, h) {
      sizes.current[i] = h;
    }, []);
    var approxHeight = config.approximateElementHeight;
    React.useEffect(function () {
      if (scrollerRef.current) {
        setDataItems(datas);
      }
    }, [scrollerRef.current, datas]);
    React.useEffect(function () {
      var i = 0;
      var current = scrollerRef.current;
      if (!current) return;

      var onScroll = function onScroll() {
        if (Math.abs(current.scrollTop - i) > approxHeight) {
          i = current.scrollTop;
          setRefresh(i);
        }
      };

      current.addEventListener('scroll', onScroll);
      return function () {
        current.removeEventListener('scroll', onScroll);
      };
    }, [scrollerRef.current, approxHeight]);
    var renderList = React.useMemo(function () {
      if (isFunction(renderElement) && scrollerRef.current) {
        var _datas = dataItems || [];

        var id = config.id,
            approximateElementHeight = config.approximateElementHeight,
            overhead = config.overhead;
        var topPos = -scrollerRef.current.scrollTop;
        var count = _datas.length;
        var pos = topPos;
        var topHeight = 0;
        var bottomHeight = 0;
        var items = [];
        var MIN_POS_X = -overhead * approximateElementHeight;
        var MAX_POS_X = scrollerRef.current.clientHeight + overhead * approximateElementHeight;
        var origin = 0;

        if (config.assumeHeightIsConstant) {
          origin = Math.floor(refresh / config.approximateElementHeight) - config.overhead;
          origin = origin < 0 ? 0 : origin;
          topHeight = origin * config.approximateElementHeight;
          pos += topHeight;
        }

        for (var i = origin; i < count; i++) {
          var h = sizes.current[i] || approximateElementHeight;

          if (pos + h < MIN_POS_X) {
            topHeight += h;
          } else if (pos > MAX_POS_X) {
            bottomHeight = (count - i) * approximateElementHeight;
            break;
          } else if (!validateItem(_datas[i], i)) {
            continue;
          } else {
            items.push(config.assumeHeightIsConstant ? renderElement(_datas[i], i) :
            /*#__PURE__*/
            React.createElement(Item, {
              key: 'item-' + i,
              index: i,
              setItemHeight: setItemHeight
            }, renderElement(_datas[i], i)));
          }

          pos += h;
        }

        items.unshift( /*#__PURE__*/React.createElement("div", {
          id: id + '-top',
          key: id + '-fake-start',
          style: {
            height: topHeight
          }
        }));
        items.push( /*#__PURE__*/React.createElement("div", {
          id: id + '-bottom',
          key: id + '-fake-end',
          style: {
            height: bottomHeight
          }
        }));
        return items;
      }
    }, [dataItems, scrollerRef.current, config, renderElement, refresh, validateItem, setItemHeight]);
    return renderList;
  }

  var Item = function Item(_ref) {
    var index = _ref.index,
        setItemHeight = _ref.setItemHeight,
        children = _ref.children;
    var itemRef = React.useRef();
    var onResize = React.useCallback(function (w, h) {
      console.log('Resize', index, w, h);
      setItemHeight(index, h);
    }, [index, setItemHeight]);

    var _useResizeDetector = reactResizeDetector.useResizeDetector({
      onResize: onResize,
      handleWidth: false
    }),
        ref = _useResizeDetector.ref;

    return /*#__PURE__*/React.createElement("div", {
      ref: ref
    }, children);
  };

  return useFakeList;

})));
//# sourceMappingURL=react-fakelist.modern.umd.js.map
