// class ItemsList {
//     constructor() {
//         this.items = [];
//     }
//
//     fetchItems() {
//         this.items = [
//             { title: 'Shirt', price: 150, num: 1 },
//             { title: 'Socks', price: 50, num: 2 },
//             { title: 'Jacket', price: 350, num: 3 },
//             { title: 'Shoes', price: 250, num: 4 },
//         ];
//     }
//
//     render() {
//         return this.items.map((item) => new Item(item.title, item.price, item.num).render()).join('');
//     }
//
//     countTotal(){
//         let total = 0;
//         this.items.forEach((elem) => {
//             total += elem.price;
//         });
//         return `<p>Total: ${total}</p>`;
//     }
// }
//
// class Item {
//     constructor(title, price, num) {
//         this.price = price;
//         this.title = title;
//         this.num = num;
//     }
//
//     render() {
//         return `<div class="goods-item"><img src="img/img-${this.num}.jpg" alt="images" class="goods-img"><h3>${this.title}</h3><p>${this.price}</p></div>`
//     }
// }
//
// class CartList {}
//
// const items = new ItemsList();
// items.fetchItems();
//
// document.querySelector('.goods-list').innerHTML = items.render();
// document.querySelector('.count-total').innerHTML = items.countTotal();

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status !== 200) {
                    reject();
                }
                const users = JSON.parse(xhr.responseText);

                resolve(users);
            }
        }
        xhr.send();
    });
}

class ItemsList {
    constructor() {
        this.items = [];
    }

    fetchItems(url) {
        return sendRequest(url)
            .then((items) => {
                this.items = items;
            });
    }

    total() {
        return this.items.reduce((acc, item) => acc + item.price, 0);
    }

    render() {
        return this.items.map((item) => new Item(item.title, item.price, item.num).render()).join('');
    }
}

class Item {
    constructor(title, price, num) {
        this.price = price;
        this.title = title;
        this.num = num;
    }

    render() {
        return `<div class="goods-item"><img src="img/img-${this.num}.jpg" alt="images" class="goods-img"><h3>${this.title}</h3><p>${this.price}</p><button>Добавить в корзину</button></div>`
    }
}

const items = new ItemsList();
items.fetchItems('http://localhost:3000/goods').then(() => {
    document.querySelector('.goods-list').innerHTML = items.render();
});

class Cart extends ItemsList {
    renderTotal() {
        return `Total ${this.total()}`
    }

    render() {
        return this.items.map((item) => new CartItem(item.title, item.price, item.num).render()).join('');
    }
}

class CartItem extends Item {
    render() {
        return `<div class="goods-item"><img src="img/img-${this.num}.jpg" alt="images" class="goods-img"><h3>${this.title}</h3><p>${this.price}</p></div>`
    }
}

const cart = new Cart();
cart.fetchItems('http://localhost:3000/cart').then(() => {
    document.querySelector('.cart-blocks').innerHTML = cart.render();
    document.querySelector('.goods-total').innerHTML = cart.renderTotal();
});