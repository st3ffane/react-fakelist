// a Hook to fake large list
import React from "react";
import { useResizeDetector } from 'react-resize-detector';
import isFunction from './is.function';
import BODY_REF from './fake.body.ref';
const TRUTHY = ()=> true;

const DEFAULT_OPTIONS = {
  id: 'fake-list', // a custom id, if used more than once in a page
  approximateElementHeight: 80, // approximated height for a component
  overhead: 3, // number of offscreen elements to draw
  assumeHeightIsConstant: true, // if true, will precalculate position based on approximateElementHeight
  // but will not be responsive. If set to false, let onResize event do **heavy** calculations
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
  const sizes = React.useRef([]); // real size of items

  const setItemHeight = React.useCallback((i, h)=>{
    sizes.current[i] = h;
  },[]);
  const approxHeight = config.approximateElementHeight;
  React.useEffect(() => {
    /* istanbul ignore else no work */
    if (scrollerRef.current) {
      // when ref got something, we can start drawing items
      setDataItems(datas)
    }
  },[scrollerRef.current, datas]);
  React.useEffect(()=>{
    let i = 0;
    let current = scrollerRef.current;
    /* istanbul ignore if no work */
    if(!current) return;
    const onScroll = ()=>{
      // if scroll more than approxHeight => redraw
      /* istanbul ignore else no work */
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
    /* istanbul ignore else dummy users */
    if(isFunction(renderElement) && scrollerRef.current){
      const datas = dataItems || [];
      // const scrollerSize = scrollerRef.current.getBoundingClientRect();
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
        
      }      
      // end of assuming --------------------------------------------------

      for(let i=origin; i< count; i++){
          const h = sizes.current[i] || approximateElementHeight;
          if(pos + h < MIN_POS_X){
            // add to top
            topHeight += h;
          } else if (pos > MAX_POS_X){
            // add to bottom
            bottomHeight = (count - i) * approximateElementHeight;
            break;
          } else if(!validateItem(datas[i],i)){
            // item should not be displayed
            continue;
          } else {
            // affiche a l'ecran
            items.push(config.assumeHeightIsConstant
            ? renderElement(datas[i], i) // render simply height constant element
            : <Item key={'item-' + i} index={i} setItemHeight={setItemHeight}>{renderElement(datas[i], i)}</Item>); // add resize calculus
          }
          pos += h; // approximateElementHeight; // add an header

      }

      // add fakers and return all
      items.unshift(<div id={id + '-top'} key={id + '-fake-start'} style={{height: topHeight}}></div>)
      items.push(<div id={id + '-bottom'} key={id + '-fake-end'} style={{height: bottomHeight}}></div>)
      return items;
    }
  }, [dataItems, scrollerRef.current, config, renderElement, refresh, validateItem, setItemHeight]);
  return renderList;
}

const Item = ({index, setItemHeight, children}) => {
  const onResize = React.useCallback((w,h)=>{
    setItemHeight(index, h)
  },[index, setItemHeight]);
  const {ref } = useResizeDetector({onResize, handleWidth: false});
  
  // React.useLayoutEffect(()=>{
  //   // each time component render, set it's size in parent
  //   if (itemRef.current && setItemHeight){
  //     let height = itemRef.current.getBoundingClientRect().height;
  //     setItemHeight(index, height)
  //   }
  // }, [ref.current, index, setItemHeight])
  return <div ref={ref}>{children}</div>;
}
