<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentalista - Flashcards Estáveis</title>
    <style>
        /* ==================== ESTILOS CSS ==================== */
        :root {
            --bg-color: #0b111e;
            --card-front: #162238;
            --card-back: #1f365d;
            --text-color: #ffffff;
            --accent-color: #00d2df;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
        }

        h1 {
            margin-bottom: 30px;
            font-size: 2.2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--accent-color);
            text-shadow: 0 2px 10px rgba(0, 210, 223, 0.2);
        }

        /* CONTAINER DOS CARDS */
        .container-flashcards {
            display: flex;
            justify-content: center;
            gap: 25px;
            flex-wrap: wrap;
            max-width: 1200px;
            width: 100%;
            margin-bottom: 30px;
        }

        /* INTERFACE DO CARD CONTROLE 3D */
        .cartao {
            width: 300px;
            height: 380px;
            perspective: 1000px;
        }

        .cartao__conteudo {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* CLASSE DE ATIVAÇÃO DA ROTAÇÃO */
        .cartao__conteudo.active {
            transform: rotateY(180deg);
        }

        /* CONFIGURAÇÃO DAS FACES */
        .cartao__face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 14px;
            padding: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.05);
        }

        .cartao__face--frente {
            background-color: var(--card-front);
        }

        .cartao__face--frente h3 {
            font-size: 1.5rem;
            font-weight: 600;
        }

        .cartao__face--verso {
            background-color: var(--card-back);
            transform: rotateY(180deg);
            border-color: var(--accent-color);
        }

        .cartao__face--verso p {
            font-size: 1.1rem;
            line-height: 1.6;
        }

        /* CONTROLES / BOTÕES */
        .controles {
            margin-top: 10px;
        }

        .botao-leitura {
            background-color: var(--accent-color);
            color: #0b111e;
            border: none;
            padding: 12px 24px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            box-shadow: 0 4px 15px rgba(0, 210, 223, 0.3);
        }

        .botao-leitura:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 210, 223, 0.5);
        }

        .botao-leitura:active {
            transform: translateY(1px);
        }
    </style>
</head>
<body>

    <h1>Mentalista - Flashcards</h1>
    
    <main class="container-flashcards">

        <!-- CARD ÚNICO DO TESTE -->
        <article class="cartao">
            <div class="cartao__conteudo">
                
                <!-- FRENTE: PERGUNTA -->
                <div class="cartao__face cartao__face--frente">
                    <h3>O que é JavaScript?</h3>
                </div>
                
                <!-- VERSO: RESPOSTA -->
                <div class="cartao__face cartao__face--verso">
                    <p>É uma linguagem de programação interpretada estruturada, que adiciona dinamismo e interatividade a páginas web.</p>
                </div>

            </div>
        </article>

    </main>

    <!-- ÁREA DO BOTÃO DE CONTROLE -->
    <div class="controles">
        <button class="botao-leitura">Ouvir Resposta</button>
    </div>

    <!-- ==================== CÓDIGO JAVASCRIPT ==================== -->
    <script>
        const botaoLeitura = document.querySelector('.botao-leitura');
        const cartaoConteudo = document.querySelector('.cartao__conteudo');
        const textoResposta = document.querySelector('.cartao__face--verso p');

        // Estado do leitor para travar bugs
        let estaLendo = false;

        function gerenciarLeituraEstavel() {
            // 1. Interrompe leituras acumuladas na fila do navegador imediatamente
            if (window.speechSynthesis.isSpeaking || estaLendo) {
                window.speechSynthesis.cancel();
                estaLendo = false;
            }

            // 2. Reseta a classe visual para garantir estabilidade em cliques rápidos
            cartaoConteudo.classList.remove('active');

            // 3. Pequena pausa (50ms) para o navegador renderizar o reset antes do novo giro
            setTimeout(() => {
                estaLendo = true;
                
                // Gira o card para o verso
                cartaoConteudo.classList.add('active');

                // Configura o motor de fala (Web Speech API)
                const fala = new SpeechSynthesisUtterance(textoResposta.textContent);
                fala.lang = 'pt-BR';
                fala.rate = 1.15; // Velocidade ajustada para ficar natural

                // Reseta a trava quando a voz terminar de falar sozinha
                fala.onend = () => {
                    estaLendo = false;
                };

                // Segurança extra caso a API do navegador falhe
                fala.onerror = () => {
                    estaLendo = false;
                    cartaoConteudo.classList.remove('active');
                };

                // Inicia a nova leitura limpa
                window.speechSynthesis.speak(fala);

            }, 50);
        }

        // Evento de clique protegido contra comportamentos inesperados
        botaoLeitura.addEventListener('click', (evento) => {
            evento.preventDefault(); // Trava envios acidentais
            gerenciarLeituraEstavel();
        });
    </script>

</body>
</html>
