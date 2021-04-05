# react-fakelist

> An Hook to render large list for your react apps.

The goal of this hook was to provide an easy way to render large amount of datas as list with windowing in my react apps, and that's pretty all it does. If you are looking for more advanced features, you should check other virtualisation libraries like https://github.com/bvaughn/react-window or https://virtuoso.dev/ They both provide some great features and I often relly on them to render my lists.

but if you are looking for a easy way to display large list, you could give it a try.


### How to: window scrolling
```js
import useFakeList from 'react-fakelist';

const renderItem = (item, index)=>{
  return  <Contact key={index} contact={item}/>
}

// virtualize list with window scrolling
function App() {
  const [emails, setEmails] = React.useState([...a bunch of object...]);
  const items = useFakeList(emails, undefined, renderItem, {approximateElementHeight: 68});
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="listContacts">
            {items}
        </div>
      </header>
    </div>
  );
}
```
### How to: div scrolling
```js
import useFakeList from 'react-fakelist';

const renderItem = (item, index)=>{
  return  <Contact key={index} contact={item}/>
}

// virtualize list with window scrolling
function App() {
  const [emails, setEmails] = React.useState([...a bunch of object...]);
  const scroller=React.useRef();
  const items = useFakeList(emails, scroller, renderItem, {approximateElementHeight: 68});
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="listContacts" style={{height: 400}} ref={scroller}>
            {items}
        </div>
      </header>
    </div>
  );
}
```
## Hook parameters:
> const items = useFakeList( datas, scrollerRef, renderItem, options)
- **datas**: Array, what to display in list
- **scrollRef**: a ref to the container of  your list (ex: a div with an height and overflow-y auto). If falsy (or undefined), will use the whole window as scroller
- **renderItem**: a function for rendering each item in the list. Will received 2 arguments:
  - **item**: the item to render
  - **index**: index in list of the item
- **options**: some configuration options for the hook
  - **id** a custom id, if used more than once in a page
  - **approximateElementHeight** approximated height for a component
  - **overhead** number of offscreen elements to draw
  - **assumeHeightIsConstant** if true, will precalculate position based on approximateElementHeight but will not be responsive. If set to false, let onResize event do **heavy** calculations
## Hook return value:
the selected items to display in your page/div. Simple as that!

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the demo app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn compile`

Build react-fakelist library

## next moves
- **Take care of items with different sizes** items with different sizes will not break anything but scrollbar behaviour can be strange, with height of document changing while items apprears (not obvious when having a lot of datas)
- **on resize items** when resizing window, if items height change, we fallback to the first issue (idem, not obvious when having a lot of datas)
- **persits item component state** when scrolling, items component get recreated as needed. If datas can be persists in a store (like redux), component only informations (ie useState, ...) get lost when component get re-created. And I don't like to store component only datas in a store. Personnal taste.
- **performance** when assuming all heights are constants, visible indexes can be precalculated easily without iterating the datas array. When assumeHeightIsConstant is false, we must calculate exactly the size with components height. There should be some algo somewhere on the net to speed up this part.
