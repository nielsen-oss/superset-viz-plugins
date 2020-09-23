const __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
const __rest =
  (this && this.__rest) ||
  function (s, e) {
    const t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && !e.includes(p)) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (!e.includes(p[i]) && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
const lib_1 = require('@superset-ui/style/lib');
const lib_2 = require('@superset-ui/translation/lib');

const Container = lib_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      ['\n  border: 1px solid #cccccc;\n  background-color: white;\n  padding: 10px;\n'],
      ['\n  border: 1px solid #cccccc;\n  background-color: white;\n  padding: 10px;\n'],
    )),
);
const Line = lib_1.default.p(
  templateObject_2 ||
    (templateObject_2 = __makeTemplateObject(['\n  color: ', ';\n'], ['\n  color: ', ';\n'])),
  function (_a) {
    const { color } = _a;
    return color;
  },
);
const BarChartTooltip = function (_a) {
  let _b;
  const { active } = _a;
  const _c = _a.payload;
  const payload = _c === void 0 ? [] : _c;
  const { label } = _a;
  const otherProps = __rest(_a, ['active', 'payload', 'label']);
  if (active) {
    const firstPayload = (_b = payload[0]) === null || _b === void 0 ? void 0 : _b.payload;
    const total =
      firstPayload === null || firstPayload === void 0 ? void 0 : firstPayload.rechartsTotal;
    return (
      <Container>
        <p>{label}</p>
        {payload.map(function (item) {
          return (
            <Line key={item.name} color={item.color}>
              {`${item.name} : ${item.value}`}
            </Line>
          );
        })}
        {total && <Line color="black">{`${lib_2.t('Total')} : ${total}`}</Line>}
      </Container>
    );
  }
  return null;
};
exports.default = BarChartTooltip;
let templateObject_1;
let templateObject_2;
