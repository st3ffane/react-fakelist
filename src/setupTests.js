// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
const Mock = {
  _test_process(){
      this.cllbck(this.elements);
    }
}
class MockObserver {
    constructor(cllbck){
      this.elements = [];
      this.cllbck = cllbck;
    }
    observe(elem) {
        // do nothing
        this.elements.push(elem)
    }
    unobserve(elem) {
        // do nothing
    }
    disconnect() {
      // same as before
      this.elements = [];
    }
    processTest(){
      this._test_process.call(this)
    }
    
}
MockObserver.__proto__ = Mock

Object.defineProperty(window, 'ResizeObserver',{
  value: MockObserver
})