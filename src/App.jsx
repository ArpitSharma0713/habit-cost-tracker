import './App.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Habitform from './Habitform.jsx';
import Habitlist from './Habitlist.jsx';
import { useState } from 'react';

function App() {
  const [habits,setHabits]=useState([]);
  const [salary, setSalary]= useState("");
  return(
    <>
    <Header/>
    <main>
      <Habitform setHabits={setHabits} />
      <Habitlist habits={habits} salary={salary} setSalary={setSalary}/>
    </main>
    <Footer/>
    </>
  );

}

export default App
