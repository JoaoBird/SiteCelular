// js/ScriptIphone.js

// Variáveis globais
let corSelecionada = 'preto';
let armazenamentoSelecionado = 512;
let precoBase = 20000;
let chipSelecionado = 'M4 PRO';

// Objeto com os caminhos das imagens para cada cor
const imagensPorCor = {
    'preto': 'Imagens/Cores_MacBook/MacBook-preto.jpg',
    'prata': 'Imagens/Cores_MacBook/MacBook-prata.jpg',
};

// Função para selecionar a cor
window.selecionarCor = function(cor) {
    corSelecionada = cor;
    console.log('Cor selecionada:', cor);
    
    // Atualiza a imagem com a cor selecionada
    const imgElement = document.getElementById('mac-pro');
    if (imgElement) {
        imgElement.src = imagensPorCor[cor];
        imgElement.alt = `MacBook Pro - ${cor}`;
    }
}

// Função para selecionar o armazenamento
window.selecionarArmazenamento = function(armazenamento) {
    armazenamentoSelecionado = armazenamento;
    console.log('Armazenamento selecionado:', armazenamento);
    
    // Calcula o novo preço e atualiza na tela
    atualizarPreco();
}

// Função para selecionar o chip
window.selecionarChip = function(chip) {
    chipSelecionado = chip;
    console.log('Chip selecionado:', chip);
    
    // Calcula o novo preço e atualiza na tela
    atualizarPreco();
}

// Função para adicionar ao carrinho
window.adicionarAoCarrinho = function(produto) {
    const item = {
        produto: produto,
        cor: corSelecionada,
        armazenamento: armazenamentoSelecionado,
        chip: chipSelecionado,
        preco: calcularPreco(),
        imagem: imagensPorCor[corSelecionada],
        return: produto
    };
    
    // Recupera o carrinho atual ou cria um novo
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Adiciona o novo item ao carrinho
    carrinho.push(item);
    
    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert('Produto adicionado ao carrinho!');
    window.location.href = 'carrinho.html';
}

// Função para calcular o preço com base na seleção
function calcularPreco() {
    let preco = precoBase;

    if (armazenamentoSelecionado === 1000) {
        preco += 10000;
    }
    if (armazenamentoSelecionado === 1000 && chipSelecionado === 'M4 MAX') {
        preco += 20000;
    }
    if (armazenamentoSelecionado === 512 && chipSelecionado === 'M4 PRO') {
        preco += 15000;
    }
    if (armazenamentoSelecionado === 1000 && chipSelecionado === 'M4 PRO') {
        preco += 12500;
    }

    return preco;
}

// Função para atualizar o preço na tela
function atualizarPreco() {
    const preco = calcularPreco();
    const precoElement = document.getElementById('preco');
    if (precoElement) {
        precoElement.innerText = preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

// Função para ver o carrinho
window.verCarrinho = function() {
    window.location.href = 'carrinho.html';
}

// Inicialização quando o documento carrega
document.addEventListener('DOMContentLoaded', function() {
    // Atualiza a imagem inicial com a cor padrão
    const imgElement = document.getElementById('mac-pro');
    if (imgElement) {
        imgElement.src = imagensPorCor[corSelecionada];
        imgElement.alt = `MacBook Pro - ${corSelecionada}`;
    }
    
    // Atualiza o preço inicial na tela
    atualizarPreco();
});
