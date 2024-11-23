// Seleciona os elementos do DOM necessários para a funcionalidade
const inputText = document.getElementById("inputText"); // Campo de entrada para o texto a ser traduzido
const outputText = document.getElementById("outputText"); // Campo de saída para o texto traduzido
const languageSelect = document.getElementById("languageSelect"); // Menu suspenso para selecionar o idioma de destino
const translateButton = document.getElementById("translateButton"); // Botão para acionar a tradução
const speakButton = document.getElementById("speakButton"); // Botão para reconhecimento de voz
const playButton = document.getElementById("playButton"); // Botão para reprodução de texto com síntese de voz

// Adiciona um evento ao botão de tradução para acionar a funcionalidade
translateButton.addEventListener("click", async () => {
    // Obtém o texto inserido pelo usuário e remove espaços extras
    const text = inputText.value.trim();
    // Obtém o idioma selecionado pelo usuário no menu suspenso
    const targetLanguage = languageSelect.value;

    // Verifica se o campo de entrada está vazio
    if (!text) {
        alert("Por favor, insira um texto para traduzir."); // Exibe um alerta ao usuário
        return; // Encerra a função se não houver texto
    }

    try {
        // Faz uma solicitação à API do Google Tradutor com os parâmetros fornecidos
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
        );

        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
            console.error("Erro na requisição:", response.status, response.statusText); // Exibe detalhes do erro no console
            alert("Erro ao traduzir. Verifique os parâmetros ou o serviço da API."); // Alerta o usuário sobre o erro
            return; // Encerra a função
        }

        // Converte a resposta da API para JSON
        const data = await response.json();
        console.log("Resposta da API:", data); // Loga a resposta no console para depuração

        // Verifica se a estrutura da resposta contém a tradução esperada
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            outputText.value = data[0][0][0]; // Atualiza o campo de saída com a tradução
        } else {
            alert("Erro ao processar a tradução."); // Alerta o usuário em caso de erro inesperado na estrutura da resposta
        }
    } catch (error) {
        console.error("Erro na tradução:", error); // Loga qualquer erro no console
        alert("Erro ao traduzir. Verifique sua conexão com a internet."); // Alerta o usuário sobre problemas de conexão
    }
});

// Adiciona um evento ao botão de reconhecimento de voz para capturar texto falado
speakButton.addEventListener("click", () => {
    // Instancia a API de reconhecimento de voz (compatível com diferentes navegadores)
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR"; // Define o idioma para reconhecimento de voz como português do Brasil

    // Função que será executada ao reconhecer uma fala
    recognition.onresult = (event) => {
        inputText.value = event.results[0][0].transcript; // Atualiza o campo de entrada com o texto reconhecido
    };

    recognition.start(); // Inicia o reconhecimento de voz
});

// Adiciona um evento ao botão de reprodução de voz para ler o texto traduzido
playButton.addEventListener("click", () => {
    // Obtém o texto do campo de saída
    const text = outputText.value;

    // Verifica se há texto disponível para reprodução
    if (!text) {
        alert("Nenhum texto para reproduzir."); // Alerta o usuário se o campo estiver vazio
        return; // Encerra a função
    }

    // Instancia a API de síntese de voz
    const synth = window.speechSynthesis;
    // Cria um objeto de fala com o texto fornecido
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelect.value; // Define o idioma da fala como o idioma selecionado
    synth.speak(utterance); // Reproduz o texto utilizando a síntese de voz
});
