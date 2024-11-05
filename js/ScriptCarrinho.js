document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho(); // Verifique se essa linha está presente
});

// Função para adicionar um produto ao carrinho
window.adicionarAoCarrinho = function(produto, corSelecionada, precoBase, imagensPorCor, armazenamento = '', chip = '') {
    const item = {
        produto: produto || 'Produto Desconhecido',
        cor: corSelecionada || 'Cor Desconhecida',
        preco: precoBase || 0,
        imagem: imagensPorCor[corSelecionada] || '',
        quantidade: 1,
        armazenamento: armazenamento || 'Padrão',
        chip: chip || 'Padrão'
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert('Produto adicionado ao carrinho!');
    window.location.href = 'carrinho.html';
};

function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

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
                ${item.produto.toLowerCase().includes("iphone") ? `<p>Armazenamento: ${item.armazenamento}GB</p>` : ''}
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



//Funcao destinada a gerar nota fiscal

function gerarNotaFiscalPDF() {
    const { jsPDF } = window.jspdf;
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        alert("O carrinho está vazio. Adicione itens antes de gerar a nota fiscal.");
        return;
    }

    const doc = new jsPDF('landscape');
    let yPosition = 30;
    let total = 0;

    const logoAppleURL = 'Imagens/Apple-logo.png';
    const logoImage = new Image();
    logoImage.src = logoAppleURL;

    logoImage.onload = function() {
        gerarPDFComLogo(doc, logoImage, carrinho, total, yPosition);
    };

    logoImage.onerror = function() {
        gerarPDFComLogo(doc, null, carrinho, total, yPosition);
    };
}

function gerarPDFComLogo(doc, logoImage, carrinho, total, yPosition) {
    if (logoImage) {
        doc.addImage(logoImage, "PNG", 10, yPosition - 10, 15, 15);
    }
    doc.setFontSize(16);
    doc.text("Apple", 30, yPosition);
    doc.text("Nota Fiscal", 140, yPosition, null, null, "center");

    yPosition += 20;
    doc.setFontSize(12);

    doc.text("Item", 20, yPosition);
    doc.text("Produto", 50, yPosition);
    doc.text("Cor", 120, yPosition);  // Aumentei a posição da cor para a direita
    doc.text("Armazenamento / Chip", 160, yPosition);  // Aumentei a posição de "Armazenamento / Chip"
    doc.text("Quantidade", 210, yPosition);
    doc.text("Preço Unitário", 240, yPosition);
    doc.text("Subtotal", 280, yPosition); // Ajuste do subtotal
    yPosition += 10;

    doc.line(10, yPosition, 290, yPosition);
    yPosition += 5;

    carrinho.forEach((item, index) => {
        total += item.preco * (item.quantidade || 1);

        let armazenamentoOuChip = '';
        if (item.produto.toLowerCase().includes("iphone") || item.produto.toLowerCase().includes("macbook")) {
            armazenamentoOuChip = item.armazenamento ? `${item.armazenamento}GB` : '';
        }
        if (item.produto.toLowerCase().includes("macbook") && item.chip) {
            armazenamentoOuChip += (armazenamentoOuChip ? ' / ' : '') + item.chip;
        }

        // Numeração dos itens ao lado da imagem
        if (item.imagem) {
            doc.addImage(item.imagem, "JPEG", 20, yPosition + 3, 12, 12);
        }

        doc.text(`${index + 1}`, 22, yPosition + 8); // Numeração do item
        doc.text(item.produto, 50, yPosition + 12);
        doc.text(item.cor || "-", 120, yPosition + 12);  // Ajustei a posição da cor
        doc.text(armazenamentoOuChip || "-", 160, yPosition + 12);  // Ajustei a posição do armazenamento/chip
        doc.text(`${item.quantidade || 1}`, 210, yPosition + 12);
        doc.text(item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 240, yPosition + 12);
        doc.text((item.preco * (item.quantidade || 1)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 280, yPosition + 12); // Ajuste do subtotal

        yPosition += 20; // Evita sobreposição

        doc.line(10, yPosition, 290, yPosition);
        yPosition += 5;

        // Verifica se precisa de uma nova página
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;  // Reseta a posição para o início da nova página
        }
    });

    // Ajuste do valor total
    yPosition += 10;
    doc.setFontSize(14);
    doc.text(`Valor Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 10, yPosition);

    doc.save("nota_fiscal.pdf");
}








function finalizarCompra() {
    gerarNotaFiscalPDF();

    // Limpa o carrinho e armazena no localStorage
    localStorage.removeItem('carrinho');
    
    // Remove o conteúdo do carrinho exibido na página e mostra "Obrigado"
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = `
        <div style="text-align: center; margin-top: 50px;">
            <h2>Obrigado pela compra!</h2>
            <p>Volte sempre que precisar :)</p>
        </div>
    `;
    
    alert('Compra finalizada! Sua nota fiscal foi gerada.');
}

// Associa a função finalizarCompra ao clique no botão de checkout
document.getElementById('checkout-btn').addEventListener('click', finalizarCompra);
