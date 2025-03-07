let bancaInicial = 0;
let bancaAtual = 0;
let percentualDiaAcumulado = 0;  // Variável para acumular o percentual

// Função para registrar a banca pela primeira vez
function registrarBanca() {
    bancaInicial = parseFloat(document.getElementById('banca').value);

    // Verificação de valor da banca
    if (isNaN(bancaInicial) || bancaInicial <= 0) {
        alert('Por favor, insira um valor válido para a banca.');
        return;
    }

    // Atualiza a banca atual
    bancaAtual = bancaInicial;

    // Atualizar o valor da banca no campo de input
    document.getElementById('banca').value = bancaInicial.toFixed(2);

    // Chama a função para calcular as entradas
    calcularEntradas();
}

// Função para calcular as entradas com base na banca e multiplicador
function calcularEntradas() {
    const entradasList = document.getElementById('entradas-list');
    const multiplicador = parseFloat(document.getElementById('multiplicador').value);

    // Limpar entradas anteriores
    entradasList.innerHTML = '';

    // Verificações
    if (isNaN(bancaInicial) || bancaInicial <= 0 || isNaN(multiplicador) || multiplicador <= 0) {
        return;
    }

    // Cálculo do total das entradas com base no multiplicador
    let total_entradas = 0;
    for (let i = 0; i < 8; i++) {
        total_entradas += multiplicador ** i;
    }

    // Calcular a primeira entrada para que a soma total seja igual à banca
    let primeira_entrada = bancaInicial / total_entradas;
    let entrada = primeira_entrada;

    // Calcular as 8 entradas com base no multiplicador
    for (let i = 0; i < 8; i++) {
        const div = document.createElement('div');
        div.classList.add('entrada-group');

        div.innerHTML = `
            <div>Entrada ${i + 1}: R$ ${entrada.toFixed(2)}</div>
            <input type="number" id="resultado${i}" placeholder="Ganho/Perda" readonly />
            <button class="botao-ganho" onclick="marcarGanho(${entrada}, ${i})">↑</button>
            <button class="botao-perda" onclick="marcarPerda(${entrada}, ${i})">↓</button>
        `;
        entradasList.appendChild(div);

        // A cada entrada, multiplica o valor pela taxa
        entrada *= multiplicador;  // Multiplica o valor da entrada pela taxa para a próxima
    }

    // Calcular percentual diário necessário para atingir 1 milhão em 1 ano
    calcularPercentualDiario();
}

// Função para marcar ganho nas entradas
function marcarGanho(valorEntrada, index) {
    const payout = parseFloat(document.getElementById('payout').value) / 100;
    const resultadoInput = document.getElementById(`resultado${index}`);
    resultadoInput.value = (valorEntrada * payout).toFixed(2);
}

// Função para marcar perda nas entradas
function marcarPerda(valorEntrada, index) {
    const resultadoInput = document.getElementById(`resultado${index}`);
    resultadoInput.value = `-${valorEntrada.toFixed(2)}`;
}

// Função para calcular novo valor da banca
function calcularNovoValor() {
    let resultadoTotal = 0;

    // Soma os ganhos/perdas das entradas
    for (let i = 0; i < 8; i++) {
        const resultado = parseFloat(document.getElementById(`resultado${i}`).value);
        if (!isNaN(resultado)) {
            resultadoTotal += resultado;
        }
    }

    // Atualiza a banca com o resultado total
    bancaAtual += resultadoTotal;
    document.getElementById('banca').value = bancaAtual.toFixed(2);

    // Acumula o percentual do dia
    const percentualNovo = ((bancaAtual - bancaInicial) / bancaInicial) * 100;
    percentualDiaAcumulado += percentualNovo;
    document.getElementById('percentual-dia').textContent = `${percentualDiaAcumulado.toFixed(2)}%`;

    // Atualizar a banca inicial para a nova banca
    bancaInicial = bancaAtual;
    document.getElementById('banca').value = bancaInicial.toFixed(2);

    // Atualiza as entradas com a nova banca
    calcularEntradas();

    // Reiniciar o cálculo do percentual diário
    calcularPercentualDiario();
}

// Função para calcular o percentual diário necessário para atingir 1 milhão em 1 ano
function calcularPercentualDiario() {
    const objetivo = 1000000;
    const diasNoAno = 365;

    const percentualNecessario = Math.pow(objetivo / bancaInicial, 1 / diasNoAno) - 1;
    const percentualDiario = percentualNecessario * 100;

    document.getElementById('percentual-diario').textContent = `${percentualDiario.toFixed(4)}%`;
}
