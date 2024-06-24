import React, { useContext } from 'react'
import './Cartitems.css'
import { ShopContext } from '../../Context/Shopcontext'
import remove_icon from '../Assets/cart_cross_icon.png'


const Cartitems = () => {

    const {getTotalCartAmount,all_product,cartItems,removeFromCart}=useContext(ShopContext)

  return (
    <div className='cartItems'>
       <div className="cart-items-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
       </div>

       <hr />

      {all_product.map((e)=>{//all_product from Db
        if(cartItems[e.id]>0)  //if quantity of product is gretaer than 0 (that is (indirectly) product is added to cart and its quantity is>0)
        { //e.id=> e is the current elemnt in all_product array and id is one of the key in current elemnt
            
         return   <div>
         <div className="cartitems-format cart-items-format-main">
            <img src={e.image} className='carticon-product-icon' alt="" />
            <p>{e.name}</p>
            <p>${e.new_price}</p>
            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
            <p>${e.new_price*cartItems[e.id]}</p>  
            {/* price of one product*quantity  */}
            <img className="cart-items-remove-icon" src={remove_icon} alt="" onClick={()=>{removeFromCart(e.id)}} />
         </div>
         <hr />
       </div>
        }
        return null
      })}

      <div className="cart-items-down">
        <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-items">
                 <p>Subtotal</p>
                 <p>${getTotalCartAmount()}</p>
             </div>
             <hr />
             <div className="cartitems-total-items">
                <p>Shipping</p>
                <p>Free</p>
             </div>
             <hr />
             <div className='cartitems-total-items'>
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
             </div>
            </div>
            <button>PROCEED TO CHECK OUT</button>
        </div>
        <div className="cartitems-promocode">
            <p>If you have a promocode enter it here</p>
            <div className="cartitem-prpmobox">
                <input type="text" placeholder='promocode' />
                <button>Submit</button>
            </div>
        </div>
    </div>
 </div>

          
         
          
          
     
      
  )
}

export default Cartitems
