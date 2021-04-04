"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFakeList;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// a Hook to fake large list
function useFakeList(_ref) {
  var _ref$datas = _ref.datas,
      datas = _ref$datas === void 0 ? [] : _ref$datas;

  var hello = _react.default.useState(datas.join(",") || "bonjour");

  return hello;
}