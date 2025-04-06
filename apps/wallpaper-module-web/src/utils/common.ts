// 防止页面被debugger
export function check() {
  function doCheck(a: number) {
    if (("" + a / a)["length"] !== 1 || a % 20 === 0) {
      (function () {
      })["constructor"]("debugger")();
    } else {
      (function () {
      })["constructor"]("debugger")();
    }
    doCheck(++a);
  }

  try {
    doCheck(0);
  } catch (err) {
  }
}
