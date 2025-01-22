document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');

    function coletarDadosFormulario() {
        console.log('Coletando dados do formulário');
        const formState = JSON.parse(localStorage.getItem('formState') || '{}');
        console.log('Dados coletados:', formState);
        return formState;
    }

    async function saveToGoogleDrive(dados) {
        console.log('Iniciando envio para Google Drive');
        const url = 'https://script.google.com/macros/s/AKfycbwlVzZ4-VHrmommOdzzYo4AOeN_M2LenrNTFfMX5WrMaWFpamApSJ2vkoiuZBpP3Pc/exec';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error('Resposta não-OK do servidor:', response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Resposta do servidor:', result);
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('A requisição excedeu o tempo limite');
            } else {
                console.error('Erro detalhado ao enviar os dados:', error);
            }
            throw error;
        }
    }

    async function processFormSubmission(event) {
        if (event) event.preventDefault();
        console.log('Processando envio do formulário');

        try {
            const dados = coletarDadosFormulario();
            if (!dados || Object.keys(dados).length === 0) {
                throw new Error('Falha ao coletar dados do formulário');
            }
            const resultadoEnvio = await saveToGoogleDrive(dados);
            console.log('Resultado do envio:', resultadoEnvio);

            if (resultadoEnvio.status === 'success') {
                alert('Formulário processado com sucesso! Um e-mail será enviado com o PDF.');
            } else {
                throw new Error('Falha no processamento do formulário');
            }
        } catch (error) {
            console.error('Erro no processamento:', error);
            alert('Ocorreu um erro ao processar o formulário. Por favor, tente novamente.');
        }
    }

    // Adicionar o listener ao botão de finalizar
    const finalizarButton = document.getElementById('finalize');
    if (finalizarButton) {
        finalizarButton.addEventListener('click', processFormSubmission);
    } else {
        console.log('Botão de finalizar não encontrado ainda');
    }
});

console.log('Script carregado completamente');
