// SELEÇÃO DOS ELEMENTOS DOM
const botaoLeitura = document.querySelector('.botao-leitura');
const cartaoConteudo = document.querySelector('.cartao__conteudo');
const textoResposta = document.querySelector('.cartao__face--verso p');

// CONTROLADORES DE ESTADO (TRAVAS DE ESTABILIDADE)
let estaLendo = false;
let timeoutReset = null;

/**
 * Executa a leitura da resposta de forma estável,
 * impedindo o acúmulo de requisições de áudio e animações.
 */
function executarLeituraEstavel() {
    // 1. IMPEÇA MÚLTIPLAS LEITURAS AO MESMO TEMPO
    // Cancela imediatamente qualquer fala ativa ou da fila do navegador
    if (window.speechSynthesis.isSpeaking || estaLendo) {
        window.speechSynthesis.cancel();
        estaLendo = false;
    }

    // Limpa timeouts anteriores para evitar execuções fantasmas em cliques rápidos
    if (timeoutReset) {
        clearTimeout(timeoutReset);
    }

    // 2. GARANTA QUE A NOVA LEITURA SUBSTITUA A ANTERIOR CORRETAMENTE
    // Força o cartão a voltar para a frente antes de reiniciar o giro
    cartaoConteudo.classList.remove('active');

    // 3. AJUSTE PARA MANTER ESTABILIDADE EM CLIQUES RÁPIDOS
    // Aguarda um intervalo mínimo (50ms) para o navegador processar o reset visual
    timeoutReset = setTimeout(() => {
        estaLendo = true;
        
        // Ativa o giro do cartão para o verso
        cartaoConteudo.classList.add('active');

        // Configura as propriedades do motor de síntese de voz
        const somUtterance = new SpeechSynthesisUtterance(textoResposta.textContent);
        somUtterance.lang = 'pt-BR'; // Idioma: Português do Brasil
        somUtterance.rate = 1.1;     // Velocidade ligeiramente acelerada para fluidez

        // Libera a trava lógica assim que a leitura terminar com sucesso
        somUtterance.onend = () => {
            estaLendo = false;
        };

        // Tratamento de erro para evitar que o sistema trave em estado "bloqueado"
        somUtterance.onerror = () => {
            estaLendo = false;
            cartaoConteudo.classList.remove('active');
        };

        // Dispara a nova fala limpa no navegador
        window.speechSynthesis.speak(somUtterance);

    }, 50); 
}

// 4. TESTE DE CLIQUES RÁPIDOS E REPETIDOS NO BOTÃO
botaoLeitura.addEventListener('click', (evento) => {
    // Evita comportamentos padrões inesperados do clique no navegador
    evento.preventDefault(); 
    
    // Executa o fluxo protegido contra múltiplos cliques
    executarLeituraEstavel();
});
