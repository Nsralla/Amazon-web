import {
    cart,addToCart
}from '../data/cart.js';
import{
    products
}from '../data/products.js';

//array of lists of products
//check the amazon.html, you will find a link to products array.
//to combine all strings together for the html page
let productsHTML = '';
document.querySelector('.js-cart-quantity').innerHTML = updateNumOfItemsInCart() ;

//let's generate the html, instead of doing it manually
//so let's loop through the array and generate the html
products.forEach((product)=>{
    productsHTML += 
    `<div class="product-container">
        <div class="product-image-container">
        <img class="product-image"
            src=${product.image}>
        </div>

        <div class="product-name limit-text-to-2-lines">
        ${product.name}
        </div>

        <div class="product-rating-container">
        <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars*10}.png">
        <div class="product-rating-count link-primary">
            ${product.rating.count}
        </div>
        </div>

        <div class="product-price">
        $${(product.priceCents/100).toFixed(2)} 
        </div>

        <div class="product-quantity-container">
        <select class ="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
        </button>
    </div>`;
    
});
// console.log(productsHTML);
//now to display {productsHTML}, we need an HTML element then put it in js which is :products-grid
document.querySelector('.js-products-grid').innerHTML = productsHTML;
let id;

//add event lister to the add to cart button
document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
    button.addEventListener('click',()=>{
        const productId = button.dataset.productId; //productId is the sam as product-id defined beside the class name for the button
        //first check if the product already exists in the cart
        addToCart(productId);
        updateNumOfItemsInCart();
        updateAddTag(productId);
    });
});



//the function which is reposnsable for adding item to cart is moved to cart.js file

function updateAddTag(productId){
    clearTimeout(id);//to make the tag appears only for 1 second
    document.querySelector(`.js-added-to-cart-${productId}`).classList.add('item-added');//get the class of the tag(Added), then add class to it,this class to make the opacity 1
    id = setTimeout(()=>{
        document.querySelector(`.js-added-to-cart-${productId}`).classList.remove('item-added');
    },1000);
}

function updateNumOfItemsInCart(){
    let cartQuantity = 0 ; //to find total quantity
    cart.forEach((cartItem)=>{
        cartQuantity+=cartItem.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity; //to change the total number of items
    return cartQuantity;
}


