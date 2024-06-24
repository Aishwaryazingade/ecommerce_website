import React, { useState } from 'react'
import './Addproduct.css'
import upload_area from '../../assets/upload_area.svg'

const Addproduct = () => {

    const [image,setImage]=useState(null)
    
    const imageHandler=(e)=>{  //to display iamge on website in upload area in admin panel
      setImage(e.target.files[0]) //sets the selected image by user
   }//  console.log(e.target.files[0])
     //  lastModified: 1717667245672
     //  lastModifiedDate: Thu Jun 06 2024 15:17:25 GMT+0530 (India Standard Time) {}
     //  name: cart_icon.png"
     //  size: 782
     //  type: "image/png"
     //  webkitRelativePath: ""
    

     //the product data should be uploaded to backend through post request so we careted the below hook
    const [productDetails,setProductDetails]=useState({  //useState initilaised with a object
     name:"",
     image:"",
     category:"women",
     new_price:"",
     old_price:""
  })

 
  const changeHandler=(e)=>{
         setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }
  //e.target.name refers to the name attribute of the input field that triggered the change. It helps identify which property of productDetails needs to be updated.
  // e.target.value contains the new value entered by the user in the input field.
// setProductDetails({...productDetails, [e.target.name]: e.target.value}) updates the productDetails state by creating a new object with the same properties
//  as the existing productDetails, but with the property corresponding to e.target.name updated to e.target.value. 



  const Add_Product=async ()=>{ //adding product to backend to /upload url
     console.log(productDetails)
// category:"women" //after givining the inputs
// image: ""
// name: "shampoo"
// new_price: "5"
// old_price: "10"

       let responseData
       let products=productDetails //we can create an instance for the state variable 
      //  console.log(product)
       //here the productDetails holds the products added via admin and the variable product is the copy of that

       //we cant directly update the image field in productDetails state variable  so we create formData object
       //and add a key value pairs like ('product',image)
       let formData= new FormData()//creates an empty object
      // console.log(formData) //empty
      formData.append('product',image);// image here is the state var which contains file info like filename,lastModified,type and size
      // // upload(formData)
      // console.log(formData) //{ key/name: 'product', value: image } ]

      // uploading product to backend to /upload url
      //  //making a post request with fetch api to the method app.post(/upload) in backend/index.js
      //   //same like we did in thunderclient by specifying filename ,method and the post method
       await fetch('http://localhost:4000/upload',{ 
           method:'POST', //it sends a POST request to http://localhost:4000/upload
           headers:{ //headers option specifies the headers sent with the request. 
            Accept:'application/json',//Accept header indicating that the client expects a JSON response from the server.
           },
           body:formData//body option specifies the data sent in the request body
          //  ('product',image) is sent 
          // where image is -->
     //  lastModified: 1717667245672
     //  lastModifiedDate: Thu Jun 06 2024 15:17:25 GMT+0530 (India Standard Time) {}
     //  name: cart_icon.png"
     //  size: 782
     //  type: "image/png"
     //  webkitRelativePath: ""

       }).then(resp=>{
         return resp.json()})
       .then((data)=>{
        // console.log(data);
      responseData=data;
      console.log(responseData) 
      // category :  "women"
      // image :  "http://localhost:4000/images/product_1718361844139_.png"
      // name: "aishwarya zinagde"
      // new_price: "20"
      // old_price: "90"
    }) //we are getting response as success and image_url through backend/index.js

    
    if(responseData.sucess){ //if upload is successful
     products.image=responseData.image_url //updates state var products (copy of productDetails)
     console.log(products)
     //we are getting response as success=1 and image_url=".." through backend/index.js
    //  product.image is the field present in product which is the copy of productDetails--> let product=productDetails

    //adding product data to /addproduct in backend/index.js so it will be stored in Db
    await fetch('http://localhost:4000/addproduct',{
          method:'POST',
          headers: {
            'Accept': 'application/json',// This header tells the server that the client expects the response to be in JSON format.
            'Content-Type':'application/json',//This header tells the server that the data being sent in the request body is in JSON format.
        },
        body:JSON.stringify(products)//products is the copy of productDetails stsate var with all fields
        //This converts the 'products' JavaScript object into a JSON string, which is required because the Content-Type is set to application/json.
        //JSON.stringify is a method in JavaScript that converts a JavaScript object or value into a JSON string 
    }).then((resp)=>resp.json())
    .then((data)=>data.sucess? alert('product added'):alert('failed')) //data.sucess accessed by app/post(/addproduct)
       }

    }

  return (
    <div className='add-product'>
       <div className="addproduct-itemfield">
         <p>Product Title</p>
         <input onChange={changeHandler} value={productDetails.name} type="text" name='name' placeholder='Type Here' />
       </div>

    <div className="addproduct-price">
      <div className="addproduct-itemfield">
         <p>Price</p>
         <input onChange={changeHandler} value={productDetails.old_price} type="text" name='old_price' placeholder='Type Here' />
       </div>

       <div className="addproduct-itemfield">
         <p>Offer Price</p>
         <input onChange={changeHandler} value={productDetails.new_price} type="text" name='new_price' placeholder='Type Here' />
       </div>
    </div>

       <div className="addproduct-itemfield">
         <p>Product Category</p>
         <select onChange={changeHandler} value={productDetails.category} name="category" className="add-product-selector" id="">
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
         </select>
       </div>

    <div className="addproduct-thumbnail-img">
        <label htmlFor='file-input'>
            <img  src={image ? URL.createObjectURL(image):upload_area}  alt="" />
        </label>
        <input type="file" onClick={imageHandler} name='image' id='file-input' hidden  />
        {/* The htmlFor='file-input' attribute in the <label> tag links the label to the <input> element with the id='file-input'  */}
    </div>


    <button onClick={()=>{Add_Product()}}className='addproduct-btn'>ADD</button>
</div>
  )
}

export default Addproduct

// URL.createObjectURL(image) used to display image in website using url
//here image in parenthesis() contains the image file