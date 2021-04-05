// Fake body ref to ensure consistency
const BodyElement = {
    // getBoundingClientRect: ()=>{
    //   // returm document.documentElement datas
    //   return document.body.getBoundingClientRect()
    // },
    addEventListener: (type, cllbck)=>{
      window.addEventListener(type, cllbck);
    },
    removeEventListener:(type, cllbck)=>{
      window.removeEventListener(type, cllbck);
    },
    __str__: 'Body Element'
};

Object.defineProperties(BodyElement, {
  'scrollTop': {
    get:()=> window.scrollY
  },
  'clientHeight': {
    get:()=> document.documentElement.clientHeight
  }
});
const BODY_REF={
  current: BodyElement
}
export default BODY_REF;