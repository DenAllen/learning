"use strict";

const ItemComponent = {
    props: ['name', 'title', 'price', 'picture'],
    template: `<div @click="handleBuyClick(id)" class="fetured-items-prod">
                        <a href="page.html">
                        <img :src="picture" alt="fetured-items-img" class="fetured-items-img">
                        <div @click="handleBuyClick(id)" class="fetured-items-black-block">
                            <div class="addtocart"">
                                <img src="img/Forma_1_copy.svg" alt="addtocart"><span>Add to Cart</span>
                            </div>
                        </div>
                        <p class="fetured-items-black">{{name}}</p>
                        <p class="fetured-items-pink">{{price}}</p>
                        <img src="img/stars.png" alt="stars" class="addtocart-stars">
                    </a>
                </div>`,
    methods: {
        handleBuyClick(id) {
            this.$emit('buy', id);
        }
    }
};

const ItemsListComponent = {
    props:['items', 'changedSize'],
    data(){
        return {
            pageNumber: 0,
        }
    },
    watch: {
        changedSize: function () {
            this.changePage(0);
        }
    },
    template: `<div>
        <item-component
          v-for="item in paginatedData"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :price="item.price"
          :picture="item.picture"
          @buy="handleBuyClick(item)"
        ></item-component>
      <div class="products-pagination">
      <div v-if="paginatedData.length === 0" class="num-pages"><p class="browse">empty</p></div>
      <div class="num-pages" v-else>
                    <button :disabled="pageNumber === 0" @click="prevPage" class="page-noactive"><i class="fas fa-angle-left"></i></button>
                    <button @click="changePage(0)" :class="changeClass(0)">1</button>
                   <button @click="changePage(p)" v-for="p of pageCount" :class="changeClass(p)" v-if="pageCount != 0">{{p + 1}}</button>
                    <button :disabled="pageNumber == pageCount" @click="nextPage" class="page-noactive"><i class="fas fa-angle-right"></i></button>
      </div>
                <button @click="clearFilers" class="view-all">View All</button></div>
      </div>`,
    methods: {
        handleBuyClick(item) {
            this.$emit('buy', item);
        },
        clearFilers(){
            this.$emit('clear');
        },
        nextPage(){
            window.scrollTo(0,450);
            this.pageNumber++;
            console.log(this.pageNumber)
        },
        prevPage(){
            window.scrollTo(0,450);
            this.pageNumber--;
            console.log(this.pageNumber)
        },
        changePage(p){
            window.scrollTo(0,450);
            this.pageNumber = p;
            console.log(this.pageNumber)
        },
        changeClass(p){
            if (p === this.pageNumber) {return "page-active"} else {return "page-noactive"}
        },
    },
    computed:{
        size() {
            return this.changedSize
        },
        pageCount(){
            let l = this.items.length;
            let s = this.size;
            console.log(this.size);
            return Math.floor(l/s);
        },
        paginatedData(){
            const start = this.pageNumber * this.size,
                end = start + this.size;
            return this.items.slice(start, end);
        },
    },
    components: {
        'item-component': ItemComponent,
    },
};

const CartItemComponent = {
    props: ['id', 'name', 'price', 'img', 'quantity', 'color', 'size'],
    data() {
        return {qty: this.quantity}
    },
    watch: {
        qty: function () {
            this.updateCart(this.id, this.qty);
        }
    },
    template: `<tr class='cart-contain-tr' :id="id">
                    <td class='cart-contain-td'>
                        <img class='cart-contain-img' :src="img" alt="Layer_43.jpg">
                        <div>
                            <h5 class="cart-contain-table-h">{{name}}</h5>
                            <p><span class="cart-contain-table-span">Color:</span>{{color}}</p>
                            <p><span class="cart-contain-table-span">Size:</span>{{size}}</p>
                        </div>
                    </td>
                    <td>
                        <p>$ {{price}}</p>
                    </td>
                    <td><input class='cart-contain-input' type="number" v-model="qty"></td>
                    <td>
                        <p>FREE</p>
                    </td>
                    <td>
                        <p>{{subTotal}}</p>
                    </td>
                    <td>
                        <p @click="updateCart(id, 0)"><i class="fas fa-times-circle"></i></p>
                    </td>
                </tr>`,
    computed: {
        subTotal() {
            let result = this.qty * this.price;
            return result
        },
    },
    methods: {
        updateCart(id, qty) {
            console.log(id);
            this.$emit('update', id, qty);
        },
    }
};

const CartListComponent = {
    props: ['cart'],
    template: `<table>
                <tr class='cart-contain-tr'>
                    <th class="checkout-adres-h first-td">Product Details</th>
                    <th class="checkout-adres-h">unite Price</th>
                    <th class="checkout-adres-h">Quantity</th>
                    <th class="checkout-adres-h">shipping</th>
                    <th class="checkout-adres-h">Subtotal</th>
                    <th class="checkout-adres-h last-td">ACTION</th>
                </tr>
    <cart-component
          v-if="cart.length"
          v-for="item in cart"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :quantity="item.qty"
          :size="item.size"
          :price="item.price"
          :img="item.picture"
          :color="item.color"
          @update="updateCart"
        ></cart-component>
        <tr v-if="!cart.length"><p class="browse cart-browse">Cart is empty</p></tr>
            </table>`,
    methods: {
        updateCart(id, qty) {
            console.log(id);
            this.$emit('update', id, qty);
        },
    },
    components: {
        'cart-component': CartItemComponent,
    },
};

const ItemPageComponent = {
    props: ['item'],
    data() {
        return {
            size: '',
            qty: 1,
            isInfoVisible: false
        }
    },
    template: `<div>
        <div class="page-content">
            <img :src="item.picture" alt="page-content-img" class="page-content-img">
        </div>
        <div class="prod-decript main-size">
            <div class="prod-decript-content">
                <h5 class="prod-decript-content-littleh">WOMEN COLLECTION</h5>
                <img src="img/Rectangle_28.svg" alt="prod-decript-content-img" class="prod-decript-content-img">
                <h4 class="prod-decript-content-bigh">{{item.name}}</h4>
                <p class="prod-decript-content-p">Compellingly actualize fully researched processes before proactive outsourcing. Progressively syndicate collaborative architectures before cutting-edge services. Completely visualize parallel core competencies rather than exceptional portals. </p>
                <div class="prod-decript-content-lotp">
                    <p class="prod-decript-content-bigp">MATERIAL:<span class="prod-decript-content-blackp">COTTON</span></p>
                    <p class="prod-decript-content-bigp">DESIGNER:<span class="prod-decript-content-blackp">BINBURHAN</span></p>
                </div>
                <p class="prod-decript-content-price">$ {{item.price}}</p>
            </div>
            <form action="#" class="prod-decript-form">
                <div class="prod-decript-form-content">
                    <div class="prod-decript-form-item">
                        <label required for="color" class="prod-decript-content-blackp">CHOOSE COLOR</label>
                        <select value="color" name="color" id="color" class="prod-decript-content-p prod-decript-content-input">
                            <option>{{item.color}}</option>
                        </select>
                    </div>
                    <div class="prod-decript-form-item">
                        <label for="size" class="prod-decript-content-blackp">CHOOSE SIZE</label>
                        <select required v-model="size" value="size" name="size" id="size" class="prod-decript-content-p prod-decript-content-input">
                            <option v-for="size in item.size">{{size}}</option>
                        </select>
                    </div>
                    <div class="prod-decript-form-item">
                        <label for="quanity" class="prod-decript-content-blackp">QUANTITY</label>
                        <input  required v-model="qty" id="quanity" class='prod-decript-content-p prod-decript-content-input' type="number">
                    </div>
                    <div class="prod-decript-form-info" v-if="isInfoVisible">you entered an invalid value</div>
                </div>
                <div class="addtocart-button" @click ="addToCart(item.id, size, qty)" ><img src="img/Forma_1_red.svg" alt=""> Add to Cart</div>
            </form>
        </div>
           </div>`,
    methods: {
        addToCart(id, size, qty) {
            if (size !== '') {
                this.isInfoVisible = false;
                this.$emit('add', id, size, qty);
            } else return this.isInfoVisible = true;
        }
    }
};

const App = new Vue({
    el: '#root',
    data: {
        items: [],
        cart: [],
        page: {},
        query: '',
        url: 'http://localhost:3000',
        size: 9,
        checkedSize: [],
        checkedPrice: 400,
        maxPrice:  400
    },
    methods: {
        handleBuyClick(item) {
                fetch(`${this.url}/page`, {
                    method: 'POST',
                    body: JSON.stringify({item}),
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
        },
        updateCart(id, qty) {
            console.log(id, qty);
            if (qty > 0) {fetch(`${this.url}/cart/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ qty: qty }),
                headers: {
                    'Content-type': 'application/json',
                }
            }).then(() => {
                fetch(`${this.url}/cart`)
                    .then(response => response.json())
                    .then((cart) => {
                        this.cart = cart;
                    });
            });} else {
                console.log(id, qty, 4);
                this.handleDeleteClick(id)
            }

        },
        handleDeleteClick(id) {
            fetch(this.url + `/cart/${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json());
            const idx = this.cart.findIndex(entity => entity.id === id);
            this.cart.splice(idx, 1);
        },
        clearFilers() {
            this.checkedSize = [];
            this.size = this.items.length;
            this.checkedPrice = this.maxPrice
        },
        addToCart(id, size, qty) {
            console.log(id, size, qty)
            const cartItem = this.cart.find((cartItem) => +cartItem.id === id);
            const item = this.items.find(item => item.id === id)
            console.log(item)


            if (cartItem) {
                fetch(`${this.url}/cart/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ qty: cartItem.qty += +qty }),
                    headers: {
                        'Content-type': 'application/json',
                    }
                }).then(() => {
                    cartItem.qty += +qty;
                });
            } else {
                fetch(`${this.url}/cart`, {
                    method: 'POST',
                    body: JSON.stringify({ ...item, qty: +qty, size: size }),
                    headers: {
                        'Content-type': 'application/json',
                    },
                }).then(() => {
                    this.cart.push({ ...item, qty: +qty, size: size });
                });
            }
        }
    },
    mounted() {
        fetch(`${this.url}/catalog`)
            .then(response => response.json())
            .then((goods) => {
                this.items = goods;
            });

        fetch(`${this.url}/cart`)
            .then(response => response.json())
            .then((cart) => {
                this.cart = cart;
            });
        fetch(`${this.url}/page/`)
            .then(response => response.json())
            .then((good) => {
                this.page = good.item;
            });
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + +item.qty * item.price, 0);
        },
        filteredItems() {
            let result;
            if (this.checkedSize.length > 0) {
                result = this.items.filter(item =>
                    item.size.some(key =>
                        this.checkedSize.includes(key)
                    ),
                )
            } else result = this.items;
            result = result.filter(item =>
                item.price <= this.checkedPrice
                );
            return result;
        },
        sortedItems() {

        }
    },
    components: {
        'items-list-component': ItemsListComponent,
        'item-page-component': ItemPageComponent,
        // 'search-component': SearchComponent,
        'cart-list-component': CartListComponent,
    },
});