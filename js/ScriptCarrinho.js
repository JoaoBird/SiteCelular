document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
});

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('compraFinalizada');
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

// Função para atualizar o carrinho
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
                <p>Preço: ${item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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

    const formatoMoeda = { style: 'currency', currency: 'BRL' };
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

// Função para gerar a nota fiscal em PDF
function gerarNotaFiscalPDF() {
    const { jsPDF } = window.jspdf;

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoFinalizado = JSON.parse(localStorage.getItem('carrinhoFinalizado')) || [];

    const itensParaPDF = carrinho.length > 0 ? carrinho : carrinhoFinalizado;

    if (itensParaPDF.length === 0) {
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
        gerarPDFComLogo(doc, logoImage, itensParaPDF, total, yPosition);
    };

    logoImage.onerror = function() {
        gerarPDFComLogo(doc, null, itensParaPDF, total, yPosition);
    };
}

function gerarPDFComLogo(doc, logoImage, carrinho, total, yPosition) {
    // Adiciona o logo e o título da nota fiscal
    if (logoImage) {
        doc.addImage(logoImage, "PNG", 10, yPosition - 10, 25, 15);
    }
    doc.setFontSize(16);
    doc.text("Apple", 35, yPosition);
    doc.text("Nota Fiscal", 140, yPosition, null, null, "center");

    yPosition += 20;
    doc.setFontSize(12);

    // Cabeçalho da tabela
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, yPosition);
    doc.text("Produto", 50, yPosition);
    doc.text("Cor", 95, yPosition);
    doc.text("Armazenamento / Chip", 125, yPosition);
    doc.text("Quantidade", 180, yPosition);
    doc.text("Preço Unitário", 210, yPosition);
    doc.text("Subtotal", 252, yPosition);

    yPosition += 10;
    doc.line(10, yPosition, 280, yPosition); // Linha abaixo do cabeçalho
    yPosition += 5;

    // Conteúdo da tabela
    doc.setFont("helvetica", "normal");
    carrinho.forEach((item, index) => {
        total += item.preco * (item.quantidade || 1);

        let armazenamentoOuChip = '';
        if (item.produto.toLowerCase().includes("iphone") || item.produto.toLowerCase().includes("macbook")) {
            armazenamentoOuChip = item.armazenamento ? `${item.armazenamento}GB` : '';
        }
        if (item.produto.toLowerCase().includes("macbook") && item.chip) {
            armazenamentoOuChip += (armazenamentoOuChip ? ' / ' : '') + item.chip;
        }


        // Conteúdo da linha
        doc.text(`${index + 1}`, 22, yPosition + 8); // Numeração do item
        doc.text(item.produto, 50, yPosition + 8);
        doc.text(item.cor || "-", 90, yPosition + 8);
        doc.text(armazenamentoOuChip || "-", 140, yPosition + 8);
        doc.text(`${item.quantidade || 1}`, 190, yPosition + 8);
        doc.text(item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 212, yPosition + 8);
        doc.text((item.preco * (item.quantidade || 1)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 250, yPosition + 8);

        yPosition += 20;

        // Linha de separação entre os itens
        doc.line(10, yPosition, 280, yPosition);
        yPosition += 5;

        // Verifica se precisa de uma nova página
        if (yPosition > 180) {  // Ajustado para evitar corte
            doc.addPage();
            yPosition = 20;  // Reseta a posição para o início da nova página
        }
    });

    // Total da compra
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Valor Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 10, yPosition);

    // Salvar o PDF
    doc.save("nota_fiscal.pdf");
}



// Função para atualizar a visibilidade do botão PDF
function atualizarBotaoPDF() {
    const pdfBtn = document.getElementById('pdf-btn');
    
    if (pdfBtn) { // Verifica se o botão PDF existe
        const compraFinalizada = localStorage.getItem('compraFinalizada') === 'true';
        console.log("Compra finalizada no localStorage:", compraFinalizada); // Log para verificar estado

        // Exibe o botão apenas se a compra foi finalizada
        pdfBtn.style.display = compraFinalizada ? 'block' : 'none';
    } else {
        console.warn("Botão PDF não encontrado no DOM.");
    }
}
// Função para finalizar a compra
function finalizarCompra() {
    gerarNotaFiscalPDF(); // Gera o PDF na primeira vez

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    localStorage.setItem('carrinhoFinalizado', JSON.stringify(carrinho)); // Salva o estado final do carrinho
    
    localStorage.setItem('compraFinalizada', 'true');
    atualizarBotaoPDF();
    
    localStorage.removeItem('carrinho'); // Limpa o carrinho após salvar
    
    
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = `
        <div style="text-align: center; margin-top: 50px;">
            <h2>Obrigado pela compra!</h2>
            <p>Volte sempre que precisar :)</p>
            <button id="pdf-btn" class="pdf-btn" onclick="gerarNotaFiscalPDF()">Baixar Nota Fiscal</button>
        </div>
    `;
    alert('Compra finalizada! Sua nota fiscal foi gerada.');
    document.getElementById('footer').style.marginTop = '20px';
    document.getElementById("mensagemAgradecimento").style.display = "block";
}

