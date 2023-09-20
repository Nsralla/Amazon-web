import {
    cart,removeFromCart,saveToLocalStorage
}from '../data/cart.js';

import{
    products
}from '../data/products.js';

let sum= 0; //for items price calculation
calculateSum();
updateItemsTopPage();

let selectedOption = null;
let productTotals = JSON.parse(localStorage.getItem('productTotals')); // used to get cheked radio buttons and to get their price
if(!productTotals){
  productTotals={};
}
let prevoiusId = undefined;
let total = 0; // for shipping calculation
calculateShippingAndHandling();
calculateTotalBeforeTax(total,sum);

 // to display total coast without tax and shiping on the page
let cartSummaryHTML = '';
cart.forEach((cartItem)=>{
    const productId = cartItem.productId;
    
    let matchingProduct; //let's search for the product by it's id
    products.forEach((product)=>{
        if(productId === product.id){
            matchingProduct=product
        }
    });

    cartSummaryHTML += 
    `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id} ">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${Number(matchingProduct.priceCents/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link"
                  data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link-${matchingProduct.id}"
                  data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options js-delivery-option-${matchingProduct.id}">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input js-delivery-option-${matchingProduct.id}"
                    name="delivery-option-${matchingProduct.id}"
                    data-product-id="${matchingProduct.id}"
                    value="0">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price js-delivery-option-price-${matchingProduct.id}"
                    data-product-id="3">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio" 
                    class="delivery-option-input js-delivery-option-${matchingProduct.id}"
                    name="delivery-option-${matchingProduct.id}"
                    data-product-id="${matchingProduct.id}"
                    value="499">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price js-delivery-option-price-${matchingProduct.id}"
                    data-product-id="2">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input js-delivery-option-${matchingProduct.id}"
                    name="delivery-option-${matchingProduct.id}"
                    data-product-id="${matchingProduct.id}"
                    value="999">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price js-delivery-option-price-${matchingProduct.id}"
                    data-product-id="1">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
});

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;//put the html at the page

document.querySelectorAll('.js-update-link').forEach((link)=>{
   link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      console.log(productId);

      //hide update button
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add('is-editing-quantity');
      link.classList.add('dissaper-update');

      //hide quantity
      const quantity = document.querySelector(`.js-quantity-${productId}`);
      quantity.classList.add('dissaper-quantity');
    });

});

//handle when click save after updating quantity
document.querySelectorAll('.save-quantity-link').forEach((link)=>{
   link.addEventListener('click',()=>{
    const productId = link.dataset.productId;
    console.log(productId);
    const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
    container.classList.remove('is-editing-quantity');  

        //handle updating the number
   const quantity = document.querySelector(`.js-quantity-input-${productId}`);
   console.log(Number(quantity.value));

   //update the cart
        cart.forEach((cartItem)=>{
            if (cartItem.productId === productId){
               cartItem.quantity = Number(quantity.value); 
            }
        });
        saveToLocalStorage();


//update the quantity
   const newQuantity = document.querySelector(`.js-quantity-${productId}`);
   console.log(Number(newQuantity.innerText));
   newQuantity.innerHTML = (quantity.value);



  //update the number of items at the top of page
  updateItemsTopPage();
  //update number of items at (order summary)
  updateOrder();

  calculateTotalBeforeTax(total,sum);

  

   });

});




document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click',()=>{
         const productId = link.dataset.productId;
         //get product id
         removeFromCart(productId);
         saveToLocalStorage();

         //when clicking delete, when need to remove  it from web page
         const container = document.querySelector(
            `.js-cart-item-container-${productId}`); //get the container that is holding the product
        container.remove();  
//update num of items in (top of page)
       updateItemsTopPage();

//update num of items in (order summary)
        updateOrder();

        //update productsTotal dictionary
        delete productTotals[productId];
        calculateShippingAndHandling();
        localStorage.setItem('productTotals',JSON.stringify(productTotals));

        calculateTotalBeforeTax(total,sum);
       

    });
});



function updateNumOfItemsInCart(){
    let cartQuantity = 0 ; //to find total quantity
    cart.forEach((cartItem)=>{
        cartQuantity+=cartItem.quantity;
    });
    return cartQuantity
}




//function to update num of items a the top of page
function updateItemsTopPage(){
   //update num of items at the top of page
   document.querySelector('.js-return-to-home-link').innerHTML= `<a class="return-to-home-link js-return-to-home-link"
   href="amazon.html">${updateNumOfItemsInCart()} items</a`;// to update num of items in the basket
}



//Lets do Review ordedr
function updateOrder(){
  //first update number of items
  const numOfItems = document.querySelector('.js-num-of-items');
  numOfItems.innerHTML =`Items(${updateNumOfItemsInCart()})`;

  //calculate total to pay without tax,without shipping
  calculateSum();

  
}



//to calculate total to pay foronly products
function calculateSum(){
   sum = 0;
  cart.forEach((cartItem)=>{
    products.forEach((product)=>{
       if(cartItem.productId === product.id ){
        console.log(product);
        sum += Number((product.priceCents*cartItem.quantity)/100);
       }
    });
    console.log(sum.toFixed(2));
  });
  //update the html
  sum = sum.toFixed(2);
  document.querySelector('.js-payment-summary-money').innerHTML =`$${sum}`;

  
  document.querySelector('.js-total').innerHTML = `$${sum}`;
}

//when choosing radio Button
document.querySelectorAll('.delivery-option-input').forEach((option)=>{
    option.addEventListener('click', ()=>{
      let productId = option.dataset.productId;
      let isZer0=0;
      
    // Initialize the total for the product if it doesn't exist
    if (!productTotals[productId]) {
      console.log('f1');
      productTotals[productId] = 0;
      isZer0=1;
    }
    if (selectedOption === option) {
      console.log('f2');
      // The same radio button was clicked twice; do nothing.
      return;
    }

    // Unselect the previously selected radio button (if any)
    if (selectedOption !== null && prevoiusId ===productId ) {
      console.log('f3');
      productTotals[productId] -= Number(selectedOption.value) / 100;
    }
  
    
    productTotals[productId] += Number(option.value) / 100;
    // Update the selected radio button
    selectedOption = option;
    console.log(`Total for Product ${productId}: $${productTotals[productId].toFixed(2)}`);
    prevoiusId= productId;
    if(isZer0){
      productTotals[productId] = Number(option.value) / 100;
    }

    //find the total shipping coast
    calculateShippingAndHandling(productTotals);

    //calulate total before tax
    calculateTotalBeforeTax(total,sum);
    //use local storage for prodcutTotals
    localStorage.setItem('productTotals',JSON.stringify(productTotals));

   
  });
});


function calculateShippingAndHandling() {
 total = 0;
  for (var key in productTotals) {
    if (productTotals.hasOwnProperty(key)) {
        console.log('Key: ' + key + ', Value: ' + productTotals[key]);
        total += productTotals[key];
    }
  }
  console.log('Total: ' + total);
  document.querySelector('.js-shipping').innerHTML =`$${total}`;



  return total;
}

function calculateTotalBeforeTax(total,sum){
  console.log(total);
  console.log(typeof(sum));
  sum = Number(sum);
  document.querySelector('.js-before-tax').innerHTML = (sum*100+total*100)/100;

  //update the tax percentage:
  document.querySelector('.js-estimated-tax').innerHTML = ((sum*100+total*100)/100)*0.1;

  //update the total
  document.querySelector('.js-total').innerHTML = Math.round((((sum*100+total*100))*0.1)+(sum*100+total*100))/100;
}

