
import React, { useEffect, useState } from 'react'
import './Listproduct.css'
import cross_icon from '../../assets/cross_icon.png'

const Listproduct = () => {
  const [allProducts,setAllProducts]=useState([])//used to get all the products stored by admin from Db

  const fetchInfo=async ()=>{

    await fetch('http://localhost:4000/allproducts') //get request for fetching  allproduct details stored in database
    .then((res)=>res.json())
    .then(data=>{setAllProducts(data)})
  }
  useEffect(()=>{ //used when the data is needed when the page is just visited
    fetchInfo()//is written in useEffect bcos whenever we visit the liist of Products in admin panel we should automatically get product added by admin
  },[]) //[] added bcoz this function should be executed only once if not given execucted again and again goes to infinite loop
  //due to thid the webpage shows undesirsble behaviour

  const remove_product=async (id)=>{ //here id got from allProducts state var
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:id}) //{"id":25}
    })
    await fetchInfo() //called again so that our list will be updated after deletion
  }

  return (
    <div className='listproduct'>
       <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
      
      <div className="listproducts-allproducts">
        <hr />
        {/* allProducts contain data fetched from Db  */}
        {allProducts.map((prod,index)=>{
          return <>
          <div key={index} className="listproduct-format-main">
             <img src={prod.image} alt="" className="listproduct-product-icon" />
             <p>{prod.name}</p>
             <p>${prod.old_price}</p>
             <p>${prod.new_price}</p>
             <p>{prod.category}</p>
             <img onClick={()=>{remove_product(prod.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
          </div>
          <hr />
          </>
        })}
      </div>
    </div>
  )
}

export default Listproduct
