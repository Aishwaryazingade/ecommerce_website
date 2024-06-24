import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Route,Routes } from 'react-router-dom'
import Addproduct from '../../Components/AddProduct/Addproduct'
import Listproduct from '../../Components/Listproduct/Listproduct'

const Asmin = () => {
  return (
    <div className='admin'>
       <Sidebar/>

       <Routes>
          <Route path='/addproduct' element={<Addproduct/>}/>
          <Route path='/listproduct' element={<Listproduct/>} />
       </Routes>
    </div>
  )
}

export default Asmin
