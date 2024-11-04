// Variáveis globais
let corSelecionada = 'preto';
let precoBase = 4000;
document.addEventListener('DOMContentLoaded', function() {
    atualizarPreco();
    
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            adicionarAoCarrinho('Apple Watch');
        });
    } else {
        console.error('Botão "Adicionar ao Carrinho" não encontrado');
    }
});

// Objeto com os caminhos das imagens para cada cor
const imagensPorCor = {
    'preto': 'Imagens/Cores_AWatch/file.png',
    'prata': 'Imagens/Cores_AWatch/file1.png',
    'ourorosa': 'Imagens/Cores_AWatch/file2.png',
};

// Função para selecionar cor
window.selecionarCor = function(cor) {
    corSelecionada = cor;
    console.log('Cor selecionada:', cor);
    
    // Atualiza a imagem
    const imgElement = document.getElementById('AWatch');
    if (imgElement && imagensPorCor[cor]) {
        imgElement.src = imagensPorCor[cor];
        imgElement.alt = `Apple Watch - ${cor}`;
    } else {
        console.error('Elemento de imagem não encontrado ou cor inválida');
    }
};

// Função para atualizar o preço
function atualizarPreco() {
    const precoElement = document.getElementById('preco');
    if (precoElement) {
        precoElement.innerText = precoBase.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

// Função para adicionar ao carrinho
window.adicionarAoCarrinho = function(produto) {
    const item = {
        produto: produto,
        cor: corSelecionada,
        preco: precoBase,
        imagem: imagensPorCor[corSelecionada],
        return: produto
    };
    
    // Recupera o carrinho atual ou cria um novo
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Adiciona o novo item
    carrinho.push(item);
    
    // Salva no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert('Produto adicionado ao carrinho!');
    window.location.href = 'carrinho.html';
};

// Função para ver carrinho
window.verCarrinho = function() {
    window.location.href = 'carrinho.html';
};

// Inicialização quando o documento carrega
