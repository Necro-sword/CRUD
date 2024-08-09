import { useState,useEffect } from 'react';
import axios from 'axios';

import './App.css'

function App() {
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] =useState([]);
  const [isModelOpen,setIsModelOpen] = useState(false);
  const [userData,setUserData] = useState({name:"",age:"",city:""});

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then(
      (res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
    });
  };

  useEffect(() =>{
    getAllUsers();
  },[]);

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
        (user) => user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText)
    );
    setFilteredUsers(filteredUsers);
  };

  //delete
  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Are You Sure You Want To delete This User");
    if(isConfirm) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data);
      });
    }
  };

 //add
 const handleAddRecord = () =>{
  setUserData({name:"",age:"",city:""});
  setIsModelOpen(true);

 };
 const closeModel =()=>{
  setIsModelOpen(false);
  getAllUsers();
 };

 const handleData = (e) => {
  const { name, value } = e.target;
  setUserData(prevData => ({ ...prevData, [name]: value }));
};


 const handleSubmit = async (e) => {
   e.preventDefault();
   if (userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then(
        (res) => {
            console.log(res);
        }
       );
    }else{
      await axios.post(`http://localhost:8000/users`,userData).then(
       (res) => {
           console.log(res);
       }
      );
    }
  };

 const handleUpdateRecord = (user) => {
     setUserData(user);
     setIsModelOpen(true);
 };


  return (
    <>
      <div className='container'>
        <h3>CRUD APPLICATION</h3>
        <div className="input-search">
          <input type="search" placeholder='Search Text Here' onChange={handleSearch}/>
          <button onClick={handleAddRecord} className='btn green'>Add Record</button>
        </div>
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th>S.no</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
             {filteredUsers && filteredUsers.map((user,index) => {
               return(
                  <tr key={`${user.id}-${index}`}>
                      <td>{index+1}</td>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                      <td>{user.city}</td>
                      <td>
                          <button className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button>
                      </td>
                      <td>
                          <button onClick={() => handleDelete(user.id)} className='btn red'>Delete</button>
                      </td>
                  </tr>
                );
              })}
          
              
            </tbody>
          </table>
          {
            isModelOpen && (
              <div className="model">
                <div className="model-content">
                  <span className='close' onClick={closeModel}>&times;</span>
                  <h3>User Update</h3>
                  <div className="input-grp">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" value={userData.name} name='name' id='name' onChange={handleData}/>
                  </div>
                  <div className="input-grp">
                    <label htmlFor="age">Age</label>
                    <input type="number" value={userData.age} name='age' id='age' onChange={handleData} />
                  </div>
                  <div className="input-grp">
                    <label htmlFor="city">City</label>
                    <input type="text" value={userData.city} name='city' id='city' onChange={handleData}/>
                  </div>
                  <button className='btn green' onClick={handleSubmit}>Update</button>
                </div>
              </div>
            )
          }
        </div>
      </div>
     
    </>
  )
}

export default App
