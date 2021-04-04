import React from 'react';
import fake from 'faker';
import useFakeList from './hook/useFakeList';
import './App.css';

const LIST_SIZE = 5000;
const renderItem = (item, index)=>{
  return  <Contact key={index} contact={item}/>
}
function App() {
  const [emails, setEmails] = React.useState(undefined);
  const [showAll, setShowAll] = React.useState(true);
  // const noDisplay = React.useCallback((item, i)=> {
  //   return showAll || item.display;
  // },[showAll]);
  const items = useFakeList(emails, undefined, renderItem,{approximateElementHeight: 68});
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
      <header className="App-header">
        
        { emails === undefined ?
          <div className="lds-dual-ring">Loading...</div>
          : <div className="listContacts">
            {items}
            </div>}
      </header>
    </div>
  );
}

function Contact({contact}){
  return <div className="contact">
    <img className={"avatar " + (contact.display ? 'display' : '')} src={contact.avatar}/>
    <div className="infos">
      <div className="email">{contact.email}</div>
      <div className="name">{contact.name}</div>
    </div>
  </div>
}

export default App;
