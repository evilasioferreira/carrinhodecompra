// Variáveis Globais
let produtos = [];
let carrinho = [];

// Função para buscar produtos da API
async function carregarProdutos() {
    const response = await fetch('https://fakestoreapi.com/products');
    produtos = await response.json();
    exibirProdutos();
}

// Exibir Produtos no Catálogo
function exibirProdutos() {
    const lista = document.getElementById('produtos-lista');
    lista.innerHTML = ''; // Limpar lista
    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.innerHTML = `
            <h3>${produto.title}</h3>
            <p>${produto.description}</p>
            <p>Preço: R$ ${produto.price.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        lista.appendChild(produtoDiv);
    });
}

// Adicionar Produto ao Carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const produtoNoCarrinho = carrinho.find(item => item.id === produtoId);

    if (produtoNoCarrinho) {
        produtoNoCarrinho.quantidade++;
    } else {
        carrinho.push({...produto, quantidade: 1});
    }

    atualizarContadorCarrinho();
    exibirCarrinho();
}

// Exibir Resumo do Carrinho
function exibirCarrinho() {
    const listaCarrinho = document.getElementById('carrinho-lista');
    listaCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        total += item.price * item.quantidade;

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <span>${item.title}</span>
            <span>Preço: R$${item.price.toFixed(2)}</span>
            <input type="number" value="${item.quantidade}" min="1" onchange="atualizarQuantidade(${item.id}, this.value)">
            <button onclick="removerDoCarrinho(${item.id})">Remover</button>
        `;
        listaCarrinho.appendChild(itemDiv);
    });

    document.getElementById('total').innerHTML = `Total: R$ ${total.toFixed(2)}`;
}

// Atualizar Quantidade de Itens no Carrinho
function atualizarQuantidade(produtoId, novaQuantidade) {
    const produto = carrinho.find(item => item.id === produtoId);
    produto.quantidade = parseInt(novaQuantidade);
    exibirCarrinho();
}

// Remover Produto do Carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarContadorCarrinho();
    exibirCarrinho();
}

// Atualizar Contador do Carrinho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('contador-carrinho');
    contador.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

// Abrir e Fechar Modal do Carrinho
function abrirCarrinho() {
    document.getElementById('modal-carrinho').style.display = "block";
}

function fecharCarrinho() {
    document.getElementById('modal-carrinho').style.display = "none";
}

// Finalizar Compra
async function finalizarCompra() {
    const pedido = {
        usuario: "usuarioTeste",  // Substituir por autenticação real
        produtos: carrinho,
        total: carrinho.reduce((sum, item) => sum + item.price * item.quantidade, 0)
    };
    
    // Aqui você pode adicionar a integração com o AfterShip
    // Enviar confirmação de pedido
    console.log('Pedido confirmado:', pedido);
    
    // Resetar carrinho
    carrinho = [];
    atualizarContadorCarrinho();
    exibirCarrinho();
    fecharCarrinho();
}

// Eventos
document.getElementById('menu-carrinho').addEventListener('click', abrirCarrinho);
document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);

// Inicialização
carregarProdutos();

// Mostrar Mensagem Temporária "Item Adicionado"
function mostrarMensagem(mensagem) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.classList.add('mensagem-temporaria');
    mensagemDiv.textContent = mensagem;
    document.body.appendChild(mensagemDiv);

    // Remover a mensagem após 3 segundos
    setTimeout(() => {
        mensagemDiv.remove();
    }, 1000);
}

// Atualizar a função de adicionar ao carrinho para incluir a mensagem
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const produtoNoCarrinho = carrinho.find(item => item.id === produtoId);

    if (produtoNoCarrinho) {
        produtoNoCarrinho.quantidade++;
    } else {
        carrinho.push({...produto, quantidade: 1});
    }

    atualizarContadorCarrinho();
    exibirCarrinho();

    // Exibir mensagem "Item adicionado"
    mostrarMensagem('Item adicionado ao carrinho');
}


