import React from 'react';
import fake from 'faker';
import useFakeList from './hook/useFakeList';
import './App.css';

const LIST_SIZE = 5000;
const renderItem = (item, index)=>{
  return  <Contact key={index} contact={item}/>
}

function Demo0({emails}){
  // SImple demo: scroll is set to window scroll (2nd param is undefined)
  const items = useFakeList(emails, undefined, renderItem,{approximateElementHeight: 68, assumeHeightIsConstant: false});
  return items;
}
function Demo1({emails}){
  // Simple demo: scroll is set to an inner div with 400px height
  const scroller=React.useRef();
  const items = useFakeList(emails, scroller, renderItem,{approximateElementHeight: 68});
  return <div className="scroller" ref={scroller}>{items}</div>;
}
function Demo3(){
  // Simple demo: scroll is set to an inner div with 400px height
  const scroller=React.useRef();
  const items = useFakeList(undefined, scroller, renderItem);
  return <div className="scroller" ref={scroller}>{items}</div>;
}

const DEMOS = [
  (emails)=> <Demo0 emails={emails}/>,
  (emails)=> <Demo1 emails={emails}/>,
  (emails)=> <Demo3/>,
];

function App() {
  const [emails, setEmails] = React.useState(undefined);
  const [demo, setDemo] = React.useState(0);
  // const [showAll, setShowAll] = React.useState(true);
  // const noDisplay = React.useCallback((item, i)=> {
  //   return showAll || item.display;
  // },[showAll]);
  // const items = useFakeList(emails, undefined, renderItem,{approximateElementHeight: 68});
  React.useEffect(()=>{
    // generate a bunch of emails
    let emails = [];
    for(let i=0; i< LIST_SIZE; i++){
      let c = {
        email: fake.internet.email(),
        name: fake.name.findName(),
        avatar: fake.internet.avatar(),
        display: fake.datatype.boolean(),
      }
      emails.push(c);
    }
    setEmails(emails);
  },[]);
  return (
    <div className="App">
      <div className="Selector">
        <input type="radio" checked={demo === 0} name="demo" onChange={()=> setDemo(0)}/>Full page
        <input type="radio" checked={demo === 1} name="demo" onChange={()=> setDemo(1)}/>In a div
        <input type="radio" checked={demo === 2} name="demo" onChange={()=> setDemo(2)}/>Empty
      </div>
      <header className="App-header">
        
        { emails === undefined ?
          <div className="lds-dual-ring">Loading...</div>
          : <div className="listContacts">
            {DEMOS[demo](emails)}
            </div>}
      </header>
    </div>
  );
}



function Contact({contact}){
  const [open, setOpen] = React.useState(false);
  const toggle = React.useCallback(()=>{
    setOpen(!open);
  }, [open]);
  const classes = React.useMemo(()=>{
    return "contact " + (open && 'open')
  }, [open]);
  return <div className={classes} onClick={toggle}>
    <img className={"avatar " + (contact.display ? 'display' : '')} src={contact.avatar}/>
    <div className="infos">
      <div className="email">{contact.email}</div>
      <div className="name">{contact.name}</div>
    </div>
  </div>
}

export default App;
