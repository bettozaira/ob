let bancaInicial = 0;
let bancaAtual = 0;
let percentualDia = 0;

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
    let totalValorEntradas = 0;

    // Calcular as 8 entradas com base no multiplicador
    let entrada = primeira_entrada;
    for (let i = 0; i < 8; i++) {
        totalValorEntradas += entrada;  // Acumula o valor das entradas
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

function marcarGanho(valorEntrada, index) {
    const payout = parseFloat(document.getElementById('payout').value) / 100;
    const resultadoInput = document.getElementById(`resultado${index}`);
    resultadoInput.value = (valorEntrada * payout).toFixed(2);
}

function marcarPerda(valorEntrada, index) {
    const resultadoInput = document.getElementById(`resultado${index}`);
    resultadoInput.value = `-${valorEntrada.toFixed(2)}`;
}

function calcularNovoValor() {
    let resultadoTotal = 0;

    // Soma os ganhos/perdas das entradas
    for (let i = 0; i < 8; i++) {
        const resultado = parseFloat(document.getElementById(`resultado${i}`).value);
        if (!isNaN(resultado)) {
            resultadoTotal += resultado;
        }
    }

    bancaAtual += resultadoTotal;
    document.getElementById('banca').value = bancaAtual.toFixed(2);

    percentualDia = ((bancaAtual - bancaInicial) / bancaInicial) * 100;
    document.getElementById('percentual-dia').textContent = `${percentualDia.toFixed(2)}%`;

    verificarMetaDiaria();
    calcularEntradas();

    // Registrar automaticamente a banca atualizada
    bancaInicial = bancaAtual;
    document.getElementById('banca').value = bancaInicial.toFixed(2);
}

function calcularPercentualDiario() {
    const objetivo = 1000000;
    const diasNoAno = 365;

    const percentualNecessario = Math.pow(objetivo / bancaInicial, 1 / diasNoAno) - 1;
    const percentualDiario = percentualNecessario * 100;

    document.getElementById('percentual-diario').textContent = `${percentualDiario.toFixed(4)}%`;
}

function verificarMetaDiaria() {
    const objetivo = 1000000;
    const diasNoAno = 365;
    const percentualNecessario = Math.pow(objetivo / bancaInicial, 1 / diasNoAno) - 1;
    const percentualDiario = percentualNecessario * 100;

    const percentualElement = document.getElementById('percentual-dia');

    if (percentualDia >= percentualDiario) {
        percentualElement.classList.add('meta-atendida');
    } else {
        percentualElement.classList.remove('meta-atendida');
    }
}
