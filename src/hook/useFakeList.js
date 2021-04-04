// a Hook to fake large list
import React from "react";
const TRUTHY = ()=> true;

const DEFAULT_OPTIONS = {
  id: 'fake-list', // a custom id, if used more than once in a page
  approximateElementHeight: 80, // approximated height for a component
  overhead: 3, // number of offscreen elements to draw
  assumeHeightIsConstant: true, // if true, will precalculate position based on approximateElementHeight
  // but will not be responsive. If set to false, let onResize event do **heavy** calculations
}

const BodyElement = {
    getBoundingClientRect: ()=>{
      // returm document.documentElement datas
      return document.body.getBoundingClientRect()
    },
    addEventListener: (type, cllbck)=>{
      window.addEventListener(type, cllbck);
    },
    removeEventListener:(type, cllbck)=>{
      window.removeEventListener(type, cllbck);
    },
    __str__: 'Body Element'
};
// add scrollY
Object.defineProperty(BodyElement, 'scrollY', {
  get:()=> window.scrollY
});
Object.defineProperty(BodyElement, 'scrollTop', {
  get:()=> window.scrollY
});
Object.defineProperty(BodyElement, 'clientHeight', {
  get:()=> document.documentElement.clientHeight
});
const BODY_REF={
  current: BodyElement
}

export default function useFakeList(
  datas = [], // full list to display
  scrollerRef = BODY_REF, // the component that scroll, if undefined, will use window
  renderElement, // a function taking datas element param for rendering
  options = DEFAULT_OPTIONS, // some informations on elements,
  validateItem = TRUTHY, // if return false, will not display this item
) {
  const [dataItems, setDataItems] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0); // will serve as refresher on scroll
  const [config] = React.useState({...DEFAULT_OPTIONS, ...options});
  const approxHeight = config.approximateElementHeight;
  React.useEffect(() => {
    if (scrollerRef.current) {
      // when ref got something, we can start drawing items
      setDataItems(datas)
    }
  },[scrollerRef.current]);
  React.useEffect(()=>{
    let i = 0;
    let current = scrollerRef.current;
    if(!current) return;
    const onScroll = ()=>{
      // if scroll more than approxHeight => redraw
        if(Math.abs(current.scrollTop - i) > approxHeight){
          i=current.scrollTop;
          setRefresh(i);          
        }
        
      };
    current.addEventListener('scroll',onScroll);
    return ()=>{
      current.removeEventListener('scroll', onScroll)
    }
  },[scrollerRef.current, approxHeight]);
  
  const renderList = React.useMemo(()=>{
    if(isFunction(renderElement) && scrollerRef.current){
      const datas = dataItems || [];
      const scrollerSize = scrollerRef.current.getBoundingClientRect();
      const {id, approximateElementHeight, overhead} = config;
      
      // simple: do all array and display on need
      // if full window => top, if !fullWindow => scrollTop
      let topPos =  - scrollerRef.current.scrollTop; 
      let count = datas.length;
      let pos = topPos; // position of 1st element in pixels
      let topHeight = 0; // heights of fakers div
      let bottomHeight = 0;
      let items = [];
      const MIN_POS_X = - overhead * approximateElementHeight;
      const MAX_POS_X = scrollerRef.current.clientHeight + overhead * approximateElementHeight;

      // console.log(MAX_POS_X, scrollerRef.current.clientHeight,scrollerSize, scrollerRef.current.scrollTop);
      let origin = 0;
      // from refresh, assume we are constantSizeItem=true ---------------
      if(config.assumeHeightIsConstant){
        // calculate 1st index
        origin = Math.floor( refresh / config.approximateElementHeight) - config.overhead;
        origin = origin < 0 ? 0 : origin;
        // add to top position
        topHeight = origin * config.approximateElementHeight;
        pos += topHeight;
      } else {
        // need to take onResize into account
        // @TODO
      }      
      // end of assuming --------------------------------------------------

      for(let i=origin; i< count; i++){
          if(pos + approximateElementHeight < MIN_POS_X){
            // add to top
            topHeight += approximateElementHeight;
          } else if (pos > MAX_POS_X){
            // add to bottom
            bottomHeight = (count - i) * approximateElementHeight;
            break;
          } else if(!validateItem(datas[i],i)){
            // item should not be displayed
            continue;
          } else {
            // affiche a l'ecran
            items.push(renderElement(datas[i], i));
          }
          pos += approximateElementHeight; // add an header

      }

      // add fakers and return all
      items.unshift(<div id={id + '-top'} key={id + '-fake-start'} style={{height: topHeight}}></div>)
      items.push(<div id={id + '-bottom'} key={id + '-fake-end'} style={{height: bottomHeight}}></div>)
      return items;
    }
  }, [dataItems, scrollerRef.current, config, renderElement, refresh, validateItem]);
  return renderList;
}


const isFunction = (obj) => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}