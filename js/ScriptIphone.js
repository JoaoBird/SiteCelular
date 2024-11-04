// js/ScriptIphone.js

// Variáveis globais
let corSelecionada = 'preto';
let armazenamentoSelecionado = 128;
let precoBase = 10000;

// Objeto com os caminhos das imagens para cada cor
const imagensPorCor = {
    'preto': 'Imagens/Cores_iphone/iphone-preto.jpg',
    'branco': 'Imagens/Cores_iphone/iphone-branco.jpg',
    'rosa': 'Imagens/Cores_iphone/iphone-rosa.jpg',
    'verde-acinzentado': 'Imagens/Cores_iphone/iphone-verde.jpg',
    'ultramarino': 'Imagens/Cores_iphone/iphone-ultramarino.jpg'
};

// Função para selecionar cor
window.selecionarCor = function(cor) {
    corSelecionada = cor;
    console.log('Cor selecionada:', cor);
    
    // Atualiza a imagem
    const imgElement = document.getElementById('iphone-img');
    if (imgElement) {
        imgElement.src = imagensPorCor[cor];
        imgElement.alt = `iPhone 16 - ${cor}`;
    } else {
        console.error('Elemento de imagem não encontrado');
    }
}

// Função para selecionar armazenamento
window.selecionarArmazenamento = function(armazenamento) {
    armazenamentoSelecionado = armazenamento;
    console.log('Armazenamento selecionado:', armazenamento);
    
    // Atualiza o preço na tela
    const preco = calcularPreco();
    document.getElementById('preco').innerText = preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para adicionar ao carrinho
window.adicionarAoCarrinho = function(produto) {
    const item = {
        produto: produto,
        cor: corSelecionada,
        armazenamento: armazenamentoSelecionado,
        preco: calcularPreco(),
        imagem: imagensPorCor[corSelecionada]
    };
    
    // Recupera o carrinho atual ou cria um novo
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('Carrinho atual:', carrinho); // Debug: Mostra o carrinho atual

    // Adiciona o novo item
    carrinho.push(item);
    
    // Salva no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert('Produto adicionado ao carrinho!');
    window.location.href = 'carrinho.html';
}

// Função para calcular preço
function calcularPreco() {
    let preco = precoBase;
    if (armazenamentoSelecionado === 256) {
        preco += 1000;
    } else if (armazenamentoSelecionado === 512) {
        preco += 2000;
    }
    return preco;
}

// Função para ver carrinho
window.verCarrinho = function() {
    window.location.href = 'carrinho.html';
}

// Inicializa o preço ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const precoElement = document.getElementById('preco');
    if (precoElement) {
        precoElement.innerText = calcularPreco().toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
});
