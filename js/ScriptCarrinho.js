document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho(); // Verifique se essa linha está presente
});

// Função para adicionar um produto ao carrinho
window.adicionarAoCarrinho = function(produto, corSelecionada, precoBase, imagensPorCor) {
    const item = {
        produto: produto || 'Produto Desconhecido',
        cor: corSelecionada || 'Cor Desconhecida',
        preco: precoBase || 0,
        imagem: imagensPorCor[corSelecionada] || '',
        quantidade: 1
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    console.log('Carrinho atualizado:', carrinho); // Debug: Veja o conteúdo do carrinho

    alert('Produto adicionado ao carrinho!');
    window.location.href = 'carrinho.html';
};

function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('Itens no carrinho:', carrinho); // Debug: Mostra o conteúdo do carrinho no console
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Seu carrinho está vazio</h2>
                <p>Adicione produtos para continuar comprando</p>
            </div>
        `;
        atualizarResumo(0);
        return;
    }

    cartItems.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        itemElement.innerHTML = `
            <img src="${item.imagem}" alt="${item.produto} ${item.cor}" class="item-image">
            <div class="item-details">
                <h3>${item.produto}</h3>
                <p>Cor: ${item.cor}</p>
                <p>Preço: ${item.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span>${item.quantidade || 1}</span>
                    <button class="quantity-btn" onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removerItem(${index})">Remover</button>
            </div>
        `;

        cartItems.appendChild(itemElement);
        subtotal += item.preco * (item.quantidade || 1);
    });

    atualizarResumo(subtotal);
}

// Função para atualizar o resumo do carrinho
function atualizarResumo(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    const formatoMoeda = {
        style: 'currency',
        currency: 'BRL'
    };

    subtotalElement.textContent = subtotal.toLocaleString('pt-BR', formatoMoeda);
    totalElement.textContent = subtotal.toLocaleString('pt-BR', formatoMoeda);
}

// Função para alterar a quantidade do item
function alterarQuantidade(index, quantidade) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const item = carrinho[index];

    if (!item.quantidade) {
        item.quantidade = 1;
    }

    if (item.quantidade + quantidade <= 0) {
        removerItem(index);
        return;
    }

    item.quantidade += quantidade;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

// Função para remover um item do carrinho
function removerItem(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}
