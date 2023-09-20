export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
 cart =  []; // to contain products added to the cart

}


export function saveToLocalStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}
export function addToCart(productId){
  
    let matchingItem;//to check if the product already exists
      cart.forEach((cartItem)=>{
        if (productId === cartItem.productId){
            matchingItem = cartItem;
        }
      });

      const selectedElement = document.querySelector(`.js-quantity-selector-${productId}`);// to get the quantity of the product
      
 

      if(matchingItem){//if already exists increament the quantity 
            matchingItem.quantity+=Number(selectedElement.value);
      }
      else{//else create new
         cart.push({
            productId:productId,
            quantity:Number(selectedElement.value)
         });
        }
        console.log(cart);
        saveToLocalStorage();
}

export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
    cart = newCart;
  });
}