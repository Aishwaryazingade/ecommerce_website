const port=4000
const express=require("express")
const app=express()
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const multer=require("multer")
const path=require("path")
const cors=require("cors")



app.use(express.json()) //whatever request we get it is paresd through json method
//used to parse incoming http request maily post req
app.use(cors())//using this our react.js project will connect to express on port 4000
//allow website on one url to request data from other url example admin page is in different url and also the frontend
//so to get data from admin in frontend we use it
//ex: website on one url(post request from /admin/src/Addproduct.js) to request data from  other url(backend: /upload)
  


//database connection with mongodb 
 mongoose.connect("mongodb+srv://aishwaryazingade292:4Ub20cs002@cluster0.dfn8j1t.mongodb.net/e-commerce")
//mongoose.connect("mongodb+srv://aishwaryazingade292:4Ub20cs002@cluster0.dfn8j1t.mongodb.net/e-commerce")

//API Creation
app.get("/",(req,res)=>{
    res.send("express app is running")
})

//we use multer to store the images in upload folder -image storage engine

//step 1:create a storage object 
 //https://www.npmjs.com/package/multer for more info

const storage=multer.diskStorage({

   destination: './upload/images',

   filename:(req,file,cb)=>{ //the parameter file contains info like filedname,size,originalname of uploaded file
      return cb(null,`${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
 }
})

//step 2: create upload object
const upload=multer({storage:storage})

//creating uplaod endpoint for images 
app.use('/images',express.static('upload/images')) //it is the path where our images are uploaded
// '/images': This is the virtual path prefix for the static directory.
//  It means that any requests that start with /images will be handled by the middleware defined in the second argument
// When a request is made to a URL that starts with /images,
//  Express will look for the requested file in the upload/images directory.


//post request from /admin/src/Addproduct.js
         //action               //name field in the formData ('product',iamge) in this iamge contains the selected file by admin
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({ //this response will be sent to client
        //this is just a object
        sucess:1, //if upload is scuccessful
        image_url:`http://localhost:${port}/images/${req.file.filename}` //this url can be used to extract the img uploaded  by pasting the link in browser
        //the app.post will get the uploaded file details through request object so req.file.filename and file.filename from storage object
        //        http://localhost:4000/images/product_1718261926693.png
        
    })
})
//when the image with formData fieldname='product' is uploaded to the page with path  /upload  
// then it is stored in destination   destination: './upload/images' with the name in the format ,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)


//adding product in mongodb database so to store in mongo we should dfeine a model / format how the data is stored
const Product=mongoose.model("Product",{
    id:{            //in this format the details of product stored in databse with additional fields like date and avilable
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
       type:String,
       required:true, 
    },
    category:{
       type:String,
       required:true, 
    },
    new_price:{
      type:Number,
      required:true,  
    },
    old_price:{
      type:Number,
      required:true,
    },
    date:{
        type:Date,
        default:Date.now(), //default will be set when the data is coming from the system itself
    },
    available:{
        type:Boolean,
        default:true,
        // product is avilable(true) or not (false)
    }
})


 
//adding products to database, //req from addproduct.js
app.post('/addproduct',async (req,res)=>{ //the post request object contains the perticular  product and details like id,image etc

     //finding product data from the database, from collection(products in monogo atlas) or model Product
    let produc_t= await Product.find({}) 
    let id;
    if(produc_t.length>0){ //if no of products in collection greater than zero that is products are more in number
         let last_product_array=produc_t.slice(-1)
         let last_product=last_product_array[0]
         id=last_product.id+1
         //the above code is written to get id of product from database  before we are getting id from req.body.id 
         //ex: if we have 10 products in Db produc_t have all those products
         //last_product_array after slicing get the last element that is 10th elemnt
         //last_product gets the only one product in last_product_array
         //if if of last product is 20 then the id of next product being added is 21
    }
    else{
        id=1 ;//if the collection is empty and have no products
    }
    // Product.find({}): This line queries the database for all products in the Product collection.
    // await: This ensures that the code waits for the find operation to complete before moving to the next line.
    // produc_t: This variable stores the array of products retrieved from the database.
    //(produc_t.length>0): This checks if there are any products in the produc_t array. If the array is not empty (i.e., length > 0), it means there are products in the collection. 
    // produc_t.slice(-1): This returns a new array containing the last element of produc_t. The slice method is used to extract a section of the array.
    // last_product_array[0]: This extracts the first (and only) element from the last_product_array, which is the last product in the original produc_t arra
    // last_product.id + 1: This assumes that product IDs are sequential integers. It takes the ID of the last product and increments it by 1 to generate a new unique ID for the next product.
    //that is if id: of last product is 22 the new id will be 23

    const product=new Product({ //the object of above defined model "Product"
       //these are details of product coming from post request
       //id:req.body.id,// written to get id of product from req.body.id 
    
      id:id, // written to get id of product from database  before were getting id from req.body.id 
      name:req.body.name,
      image:req.body.image,
      category:req.body.category,
      new_price:req.body.new_price,
      old_price:req.body.old_price,
    })
    console.log(product)
    await product.save() //to save a single product in Db under the collection products
    console.log("Saved")
    res.json({  //response will be generated  for client
        sucess:true,
        name:req.body.name,
    })
    
})

//output of above code
// {
//     id: 22,
//     name: 'product 123',
//     image: 'http://localhost:4000/images/product_1718264849903_.png',
//     category: 'kid',
//     new_price: 9,
//     old_price: 10,
//     date: 2024-06-13T07:51:17.656Z,
//     available: true,
//     _id: new ObjectId('666aa4f88fafa258e504364a')
//   }
//   Saved
// {
    //     "sucess": true,
    //     "name": "product 123"
    //   }


 //removing products from database .req from listproduct.js
 app.post('/removeproduct',async (req,res)=>{
       await Product.findOneAndDelete({id:req.body.id}) //fetches data from Product collection with id of product to be deleted
       console.log("removed")
       res.json({
        sucess:true,
        name:req.body.name,
       })

    //    { //reponse to client
    //     "sucess": true,
    //     "name": "product 123",
    //   }
    })

    //req from listproduct.js
app.get("/allproducts",async (req,res)=>{
    let products=await Product.find({})
    // console.log("all products fetched")
    res.send(products) //all products in eccommerce Db under products collection are returned to ShopContext.js(get req)
})

//creating endpoint for newcollections
app.get("/newcollections",async (req,res)=>{
     
     let products=await Product.find({}) //this is fetched from Db=ecommerce and products collection( Db model Product)
     //console.log(products)
     //finds all products in Db {} empty object means fetch all products
     let newcollection=products.slice(1).slice(-8) //extracts starting 8 products from Db
     //console.log(newcollection)
     res.send(newcollection)
})

app.get("/popularinwomen",async(req,res)=>{ //post req from frontend/popular.js
    let products=await Product.find({category:"women"}) //data with category =women are fetched
    let popular_in_women=products.slice(1).slice(-4)
    // console.log("popular in women fetched")
    res.send(popular_in_women)
})


//schema for users
const Users=mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true //email is not duplicated
    },
    password:{
        type:Object
    },
    cartData:{
        type:Object
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

//creating endpoint for registering users
app.post('/signup',async(req,res)=>{

                                  //email in Db  //email in post request
    let check=await Users.findOne({email:req.body.email}) 
    //Model.findOne(conditions, [projection], [options], [callback]);
    //conditions:An object specifying the query criteria (required)
    //findOne(): method in Mongoose is used to find a single document in a MongoDB collection that matches the given criteria.
    //returns null if no document matches otherwise returns matching document

    if(check){
        return res.status(400).json( //res.json({object}) //400 bad request
            {sucess:false,
            errors:"existing user found"})
    }
    cart={} //if user doesnot exist create a cart object for him
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    //Users model object
    const user=new Users({ //this object stores the values sent through req.body in our model
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })
    await user.save() //save user data under collection users
    // console.log(user)
    // {   
    //     name: ' aishuser',
    //     email: 'useraishu@gmail.com',
    //     password: '12345678',
    //     cartData: { '0':0, "1":0 upto '299:0'}
    //     date: 2024-06-15T03:03:46.904Z,
    //    _id: new ObjectId('666d04982aadc9887dc08225') }

    //when the user logins the server stores session data which is memory consuming so we use jwt for user data
    //creating token for the following data
    const data={ // A1.tokenizing
        user:{
            id:user.id //_id: new ObjectId('666d04982aadc9887dc08225') this id from Db
        }
    }

    //jwt used to store the actualdata in token which can be read by anyone but cant change it
    // The goal here is to generate a JSON Web Token (JWT) when a user (presumably after a successful login or some form of authentication) is making a request
    const token=jwt.sign(data,'secret_ecom')
    res.json({ //after sucessful registration
        sucess:"true",
        token
    })
    // { response after post request
    //     "sucess": "true",
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2ZDA0OTgyYWFkYzk4ODdkYzA4MjI1In0sImlhdCI6MTcxODQyMDYzMn0.XYaWAH73B3cTk_KVB0g0MO5tWCNd_Q9YPf4dKN4rKM8"
    //   }
})

//cretaing login endpoint
app.post('/login',async (req,res)=>{
   let user=await Users.findOne({email:req.body.email}) //if email is existing or not
   //console.log(user)
   if(user){
       //check password if user is existing
       const passCompare= req.body.password ===user.password //password in request and password in Db
       if(passCompare){
        const data={ //if password is correct create an object for user
            user:{
                id:user.id
            }
        }
        const token=jwt.sign(data,'secret_ecom')  //if password is correct create jwt token and success as response
        res.json({sucess:true,token}) //after successfull login
       } else{
        //if password doesnot matchres
        res.json({sucess:false,errors:"wrong password"})
       }
   }else{
       res.json({sucess:false,errors:"wrong email-id"})
   }
})

//creating widdelware to fetch user //request from shopcontext.js
// This function is an Express middleware that verifies a JWT token for authentication purposes
const fetchuser=async (req,res,next)=>{
    const token=req.header('auth-token')//Token Retrieval: The token is extracted from the auth-token header of the incoming request.
    if(!token){
        res.status(401).send({errors:"Please autenticate using valid token"})
    }
    else{
        //if token is present decode it get user data
        console.log("try block")
        try{
            //decode token
            const data=jwt.verify(token,'secret_ecom')   //A1.detokenizing                        //iat:"issued at" timestamp.
            console.log("the verified data is",data) //{ user: { id: '666e580f48f9838070d1713a' }, iat: 1718507873 }
            // the verified data is { user: { id: '666e580f48f9838070d1713a' }, iat: 1718508685 }
            //now the decoded token is passed throgh req body to the next async function present in /addtocart end point
            req.user=data.user //The decoded token data (usually containing user information) is attached to the req object (e.g., req.user = data.user).
            //After decoding, the payload of the token contains the user data. 
            //The middleware attaches the user part of the decoded token data to the req object
            next()//If the token is valid, the middleware calls next() to pass control to the next middleware or route handler.(here route handler is the async function in /addtocart endopoint)
        }
        catch(error){
            res.status(401).send({errors:"Please autenticate using valid user"})
        }
    }
}

// req from shopContext.js in method adtocart()
//addtocart endpoint
app.post("/addtocart",fetchuser,async(req,res)=>{

    
    console.log(req.body,req.user)  //({"itemid":itemId}) we sent this throgh post method from shopContext.js
    //{ itemId: 24 } { id: '666e580f48f9838070d1713a' } //userdata extracted from the token
                      //user id from token
  
     let userdata =await Users.findOne({_id:req.user.id})//_id is a field in the document in users collection 
     //  //req.user.id getting from middeleware
     //get the complete user details which match the id in user token
    userdata.cartData[req.body.itemId]= userdata.cartData[req.body.itemId]+1 
     //userdata contains every details of user like emial,name,password and empty cartData
    //  req.body.itemId the itemid sent through req 
    //the req body only contained itemId previously but after executing the userfetch() it got another field  the userId
    //after incremnting update cartData
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData}) //finds id and update cartData
    console.log("added item with id",req.body.itemId)
    res.send("Added")
})

// req from shopContext.js in method removefromcart()
//creating endpoint to remove product from cartData
app.post('/removefromcart',fetchuser, async(req,res)=>{
    let userdata =await Users.findOne({_id:req.user.id})
    if(userdata.cartData[req.body.itemId]>0)
    userdata.cartData[req.body.itemId]= userdata.cartData[req.body.itemId]-1
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData}) 
    console.log("removed item with id",req.body.itemId)
    res.send("removed")
})

//creating endpoint to get cartData and display for perticular user
// req from shopContext.js in useEffect bcos when logged in user should iimediately get his cartItems
app.post('/getcart',fetchuser,async(req,res)=>{
    console.log("get cart")
    let userdata=await Users.findOne({_id:req.user.id}) //userData with specified id is fetched from Db
    res.json(userdata.cartData) //the cartData field is sent as response
})

app.listen(port,(error)=>{
    if(!error){
     console.log("server running on port "+ port)
    }
    else{
     console.log("Error :" + error)
    }
})


// Stateful Authentication:

// Server stores session state.
// Requires session management and storage.
// Session data retrieval on each request.

// Stateless Authentication (JWT-json webtoken):

// Server does not store session state.
// Token contains all necessary information and is self-contained.
// Verification of token signature on each request