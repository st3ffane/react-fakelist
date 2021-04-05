import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import useFakeList from './useFakeList';

// fake datas
const test_datas = [];
for(let i=0; i<100;i++) test_datas.push('item-'+i);
// redering function
const renderItem = (item, i)=> <div key={i}>{item}</div>
// some dumb component to include the hook
// full screen
const DUMB = ({items})=>{
  return useFakeList(items, undefined, renderItem, {approximateElementHeight: 10});
}
const DUMB_DIV = ({items, responsive = false})=>{
  const scroller = React.useRef();
  const elements = useFakeList(items, scroller, renderItem, {approximateElementHeight: 10, assumeHeightIsConstant : !responsive});
  return <div data-testid="scroller" ref={scroller} style={{height: 400, overflow: "scroll"}}>{elements}</div>
}
const EMPTY_DUMB_DIV = ()=>{
  const scroller = React.useRef();
  const elements = useFakeList(undefined, scroller, renderItem);
  return <div data-testid="scroller" ref={scroller} style={{height: 400, overflow: "scroll"}}>{elements}</div>
}
test('renders fake list with default params- div', () => {
  //  height of 400px; means display 4 items?
  const { container } = render(<EMPTY_DUMB_DIV/>);
  fireEvent.scroll(screen.getByTestId('scroller'), { target: { scrollTop: 100 } })
  // top should be 0
  let top = container.querySelector('#fake-list-top');
  expect(top.getAttribute('style') === "height: 0px;").toBeTruthy();
  // bottom should be 0 px
  top = container.querySelector('#fake-list-bottom');
  expect(top.getAttribute('style') === "height: 0px;").toBeTruthy();
});
test('renders fake list of 100 items- full window', () => {
  
  render(<DUMB items={test_datas}/>);
  const firstElement = screen.getByText(/item-0/i);
  expect(firstElement).toBeInTheDocument();
});
test('renders fake list of 100 items and scroll- full window', () => {
  
  const {container} = render(<DUMB items={test_datas}/>);
  // scroll by 100px, ie 10 elements
  fireEvent.scroll(window, { target: { scrollY: 100 } })
  // faker top should be 10 * (10 - 3) px (3-> default overhead)
  const top = container.querySelector('#fake-list-top');
  expect(top.getAttribute('style') === "height: 70px;").toBeTruthy();
  
  const firstElement = screen.getByText(/item-7/i);
  expect(firstElement).toBeInTheDocument();
});
test('renders fake list of 100 items- div', () => {
  //  height of 400px; means display 4 items?
  const { container } = render(<DUMB_DIV items={test_datas}/>);
  let firstElement = screen.getByText(/item-0/i);
  expect(firstElement).toBeInTheDocument();
  firstElement = screen.getByText(/item-3/i);
  expect(firstElement).toBeInTheDocument();
  firstElement = screen.queryByText(/item-4/i);
  expect(firstElement).toBeFalsy();

  // top should be 0
  let top = container.querySelector('#fake-list-top');
  expect(top.getAttribute('style') === "height: 0px;").toBeTruthy();
  // bottom should be 100 - 4 * 10 px
  top = container.querySelector('#fake-list-bottom');
  expect(top.getAttribute('style') === "height: 960px;").toBeTruthy();
});
test('renders fake list of 100 items and scroll- div', () => {
  //  height of 400px; means display 4 items?
  const { container } = render(<DUMB_DIV items={test_datas}/>);
  fireEvent.scroll(screen.getByTestId('scroller'), { target: { scrollTop: 100 } })
  const firstElement = screen.getByText(/item-7/i);
  expect(firstElement).toBeInTheDocument();
  // top should be 70
  let top = container.querySelector('#fake-list-top');
  expect(top.getAttribute('style') === "height: 70px;").toBeTruthy();
  // bottom should be 860 px
  top = container.querySelector('#fake-list-bottom');
  expect(top.getAttribute('style') === "height: 860px;").toBeTruthy();
});
test('renders fake list of 100 items and scroll- div - no constant height', () => {
  //  height of 400px; means display 4 items?
  const { container } = render(<DUMB_DIV items={test_datas} responsive={true}/>);
  fireEvent.scroll(screen.getByTestId('scroller'), { target: { scrollTop: 100 } })
  const firstElement = screen.getByText(/item-7/i);
  expect(firstElement).toBeInTheDocument();
  // top should be 70
  let top = container.querySelector('#fake-list-top');

  expect(top.getAttribute('style') === "height: 60px;").toBeTruthy();
  // bottom should be 860 px
  top = container.querySelector('#fake-list-bottom');
  expect(top.getAttribute('style') === "height: 860px;").toBeTruthy();
});