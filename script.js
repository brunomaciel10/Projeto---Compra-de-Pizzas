// atalho para o document.querySelector
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// variáveis globais
let modalQt = 1;
let cart = [];
let modalKey = 0;

// LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
    let pizzaItem = c(".models .pizza-item").cloneNode(true); // serve para clonar o elemento

    // atributo para identificar as pizzas
    pizzaItem.setAttribute("data-key", index);

    // preenche as informações das pizzas
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    
    // função para abrir o modal
    pizzaItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();

        // identifica o modal de acordo com a pizza
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalKey = key;

        // quantidade padrão de pizzas
        modalQt = 1;

        // preenche as informações do modal
        c(".pizzaBig img").src = pizzaJson[key].img;
        c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        // organiza os tamanhos das pizzas
        c(".pizzaInfo--size.selected").classList.remove("selected");
        cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        // preenche a quantidade de pizzas
        c(".pizzaInfo--qt").innerHTML = modalQt;

        // animação para mostrar o modal
        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = "flex";
        setTimeout(() => {
            c(".pizzaWindowArea").style.opacity = 1;
        }, 200);
    });

    // adiciona as informações na tela
    c(".pizza-area").append(pizzaItem);
});

/**/

// EVENTOS DO MODAL
function closeModal() {
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
        c(".pizzaWindowArea").style.display = "none";
    }, 500);
};
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", closeModal);
});

// botões de adicionar ou remover as pizzas
c(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    c(".pizzaInfo--qt").innerHTML = modalQt;
});
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
    if(modalQt > 1) {
        modalQt--;
        c(".pizzaInfo--qt").innerHTML = modalQt;
    };
});

// selecionar o tamanho da pizza
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener("click", () => {
        c(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected"); 
    });
});

// adicionar ao carrinho de compras
c(".pizzaInfo--addButton").addEventListener("click", () => {
    let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

    // junta as informações de tamanho e o ID da pizza
    let identifier = pizzaJson[modalKey].id+"@"+size;

    // verifica se existe alguma pizza igual dentro do carrinho, se não irá adicionar um item novo
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

/**/

// EVENTOS DO CARRINHO DE COMPRAS
function updateCart() {

    // altera a quantidade de itens no carrinho MOBILE
    c(".menu-openner span").innerHTML = cart.length;

    // abrir o carrinho e preencher as informações
    if (cart.length > 0) {
        c("aside").classList.add("show");
        c(".cart").innerHTML = "";

        // variáveis do preço
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

            // calcular o subtotal
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c(".models .cart--item").cloneNode(true); // serve para clonar o elemento

            // preencher o nome e o tamanho da pizza escolhida
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = "P"
                break;
                case 1: 
                    pizzaSizeName = "M"
                break;
                case 2:
                    pizzaSizeName = "G"
                break;  
            };
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            // preenche as informações das pizzas
            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

            // aumentar ou diminuir a quantidade pizzas no carrinho
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                };
                updateCart();
            });
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                cart[i].qt++;
                updateCart();
            });

            // adiciona o clone na tela
            c(".cart").append(cartItem);
        };

        // calcular o desconto e o total do pedido
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        // preenche as informações do preço
        c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c("aside").classList.remove("show"); // fechar o carrinho no DESKTOP
        c("aside").style.left = "100vw"; // fechar o carrinho no MOBILE
    }
};

// abrir ou fechar o carrinho no MOBILE
c(".menu-openner").addEventListener("click", () => {
    if(cart.length > 0) {
        c("aside").style.left = "0";
    };
});
c(".menu-closer").addEventListener("click", () => {
    c("aside").style.left = "100vw";
});