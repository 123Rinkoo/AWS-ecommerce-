const Product = require('../models/product');
// const Cart = require('../models/cart'); 
// const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  const page= +req.query.paaag || 1;
  console.log(page);
  const itemsperpage=3;
  let totalItems;
  Product.count()
  .then((total=>{
    totalItems=total;
    return Product.findAll({offset: (page-1)*itemsperpage , limit: itemsperpage})
  }))
    .then(products => {
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
      res.json({
        Products: products,
        currentPage: page,
        hasNextPage: itemsperpage*page<totalItems,
        nextPage: page+1,
        hasPreviousPage: page>1,
        previousPage: page-1,
        lastPage: Math.ceil(totalItems/itemsperpage)
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
          res.json(products);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
  if(!req.body.productId){
    return res.status(404).json({success: true, message: 'Product id is missing'});
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({success: true, message: "Successfully added the product"});
    })
    .catch(() => res.status(500).json({success: false, message:" Error occured"}));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let orderId;
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      console.log(products);
      if(products.length==0){
      return  res.json({orderId, success:false, message: `Your Cart Is Empty`});
      }
      req.user.createOrder()
        .then(order => {
          orderId = order.id;
          // console.log("this is line no 157", order.id);
          order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then(result => {
          fetchedCart.destroy();
          res.json({orderId, success:true, message: `your order with order id: ${orderId} has been placed`});
        })
        .catch(err => console.log(err))
    })
    .catch(err => { console.log(err) })
}

exports.getOrders = (req, res, next) => {

    //  req.user
    //   .getOrders()
    //   .then(orders => {
    //         // res.render('shop/cart', {
    //         //   path: '/cart',
    //         //   pageTitle: 'Your Cart',
    //         //   products: products 
    //         // });
    //         // res.json(orders);
    //         return orders.getProducts();
    //       })
    //       .then(prods=>{
    //           res.json(prods);
    //       })
    //       .catch(err=>console.log(err))
    //   .catch(err => console.log(err));
    req.user
    .getOrders( {include: ['products']})
    .then(orders => {
      res.json(orders);
      // return order
      //   .getProducts()
      //   .then(products => {
      //     // res.render('shop/cart', {
      //     //   path: '/cart',
      //     //   pageTitle: 'Your Cart',
      //     //   products: products
      //     // });
      //     res.json(products);
      //   })
      //   .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
