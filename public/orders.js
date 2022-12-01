window.onload = function () {
    console.log('i am here')
    axios.get('http://52.194.241.2:3000/orders')
        .then(res => {
            DisplayingOrderRecord(res.data);
            console.log(res.data)
        })
        .catch(err => console.log(err));
}

function DisplayingOrderRecord(MyOrderings) {
    const main = document.getElementById('MYorders');
    for (var i = 0; i < MyOrderings.length; i++) {
        const mainchild1 = document.createElement('div');
        mainchild1.classList.add('ordertop');
        mainchild1.innerHTML = `<br><hr><h2>Orders ID: ${MyOrderings[i].id} </h2>`
        for (var j = 0; j < MyOrderings[i].products.length; j++) {
            mainchild1.innerHTML = mainchild1.innerHTML + ` <div class="orderProducts">
            <img src="${MyOrderings[i].products[j].imageUrl}"
            alt="">
        <h3>${MyOrderings[i].products[j].title}</h3>
        <h3>$${MyOrderings[i].products[j].price}</h3>
        </div>`
        }
        console.log(i)
        main.appendChild(mainchild1);
    }
}


