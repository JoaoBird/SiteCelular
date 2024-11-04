let corSelecionada = 'preto';
let precoBase = 6500;

const imagensPorCor = {
    'azul': './Imagens/Cores_AirPod/AirPod_Azul.jpg',
    'estelar': './Imagens/Cores_AirPod/AirPod_Estelar.jpg',
    'laranja': './Imagens/Cores_AirPod/AirPod_Laranja.jpg',
    'preto': './Imagens/Cores_AirPod/AirPod_Preto.jpg',
    'roxo': './Imagens/Cores_AirPod/AirPod_Roxo.jpg'
};

window.selecionarCor = function(cor) {
    corSelecionada = cor;
    console.log('Cor selecionada:', cor);
    
    const imgElement = document.getElementById('AP_Max');
    if (imgElement && imagensPorCor[cor]) {
        imgElement.src = imagensPorCor[cor];
        imgElement.alt = `AirPod Max - ${cor}`;
    } else {
        console.error('Elemento de imagem não encontrado ou cor inválida');
    }
};

function atualizarPreco() {
    const precoElement = document.getElementById('preco');
    if (precoElement) {
        precoElement.innerText = precoBase.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

window.adicionarAoCarrinho = function(produto) {
    const item = {
        produto:produto,
        cor: corSelecionada,
        preco: precoBase,
        imagem: imagensPorCor[corSelecionada],
        return: produto
        
    };
    
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert('Produto adicionado ao carrinho!');
    window.location.href = 'carrinho.html';
};

window.verCarrinho = function() {
    window.location.href = 'carrinho.html';
};

document.addEventListener('DOMContentLoaded', function() {
    atualizarPreco();
    
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            adicionarAoCarrinho('AirPod Max');
        });
    }
});