window.onload = function () {
    event.preventDefault();
    //     axios.get('http://localhost:3000/products')
    //         .then(Cdata => showingOnScreen(Cdata.data))
    //         .catch(err => console.log(err));
    let pagenumber = 1;
    axios.get(`http://localhost:3000/products?paaag=${pagenumber}`)
        .then(res => {
            showingOnScreen(res.data.Products);
            ShowingPagination(res.data);
        })
        .catch(err => console.log(err));

    axios.get('http://localhost:3000/cart')
        .then((CartProducts) => {
            addingToCard(CartProducts.data)
        })
        .catch((err) => { console.log(err) });
}

function showingOnScreen(YourProducts) {
    const main = document.getElementById('Product-content');
    main.innerHTML = "";
    for (let i = 0; i < YourProducts.length; i++) {
        const mainChild = `<div id="plant1">
        <h3>${YourProducts[i].title}</h3>
        <div class="image-container">
            <img class="prod-images"
                src="${YourProducts[i].imageUrl}"
                alt="">
        </div>
        <div class="prod-details">
            <span>$${YourProducts[i].price}</span>
        </div>
        <button class="shop-item-button" type="button" onclick="addToCart(${YourProducts[i].id})">ADD TO CART</button>
    </div>`
        main.innerHTML = main.innerHTML + mainChild;
    }
}

function whenCartButtonClick(event) {
    console.log("working")
    event.preventDefault();
    axios.get('http://localhost:3000/cart')
        .then((CartProducts) => {
            addingToCard(CartProducts.data)
        })
        .catch((err) => { console.log(err) });
}

function ShowingPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = "";
    if (hasPreviousPage) {
        const btn1 = document.createElement('button');
        btn1.innerText = previousPage;
        btn1.addEventListener('click', () => { getproducts(previousPage) });
        pagination.appendChild(btn1);
    }
    const btn2 = document.createElement('button');
    btn2.innerText = currentPage;
    btn2.addEventListener('click', () => { getproducts(currentPage) });
    pagination.appendChild(btn2);

    if (hasNextPage) {
        const btn3 = document.createElement('button')
        btn3.innerText = nextPage;
        btn3.addEventListener('click', () => { getproducts(nextPage) });
        pagination.appendChild(btn3);
    }
}

function getproducts(page) {
    axios.get(`http://localhost:3000/products?paaag=${page}`)
        .then(res => {
            showingOnScreen(res.data.Products);
            ShowingPagination(res.data);
        })
        .catch(err => console.log(err));
}

function addToCart(productId) {
    axios.post('http://localhost:3000/cart', { productId: productId })
        .then((response) => {
            if (response.status === 200) {
                notifyUsers(response.data.message);
            }
            else {
                throw new Error();
            }
        })
        .catch(err => console.log(err));
}

function notifyUsers(message) {
    // ........this is for notification.......
    const container = document.getElementById('planty');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

function addingToCard(CartData) {
    for (let i = 0; i < CartData.length; i++) {
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        var cartRowContents = `<div class="cart-row" 
        id="in-cart-album1">
    <span class="cart-item cart-column">
        <img class="cart-img"
            src="${CartData[i].imageUrl}"
            alt="">
        <span>${CartData[i].title}</span>
    </span>
    <span class="cart-price cart-column">${CartData[i].price}</span>
    <span class="cart-quantity cart-column">
        <input type="text" value="${CartData[i].cartItem.quantity}">
        <button>REMOVE</button>
    </span>
</div>`
        cartRow.innerHTML = cartRowContents
        cartItems.append(cartRow);
    }
}

function SavingOrderDetails() {
    axios.post("http://localhost:3000/create-order")
        .then(res => {
            console.log(res)
            orderNotification(res.data.message);
        })
        .catch(err => { console.log(err) });
}

function orderNotification(message) {
    const container = document.getElementById('planty');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `${message}`;
    container.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

function ShowingCart() {
    const id = document.getElementById('cart');
    id.style = "display: block";
    // axios.get('http://localhost:3000/cart')
    //     .then((CartProducts) => {
    //         addingToCard(CartProducts.data)
    //     })
    //     .catch((err) => { console.log(err) });
}
function CartCancel() {
    const id1 = document.getElementById('cart');
    id1.style = "display: none";
}
