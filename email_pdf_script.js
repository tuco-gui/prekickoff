document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');

    function coletarDadosFormulario() {
        console.log('Coletando dados do formulário');
        const form = document.querySelector('form');
        const formData = new FormData(form);
        const dadosObj = {};
        for (let [key, value] of formData.entries()) {
            dadosObj[key] = value;
        }
        console.log('Dados coletados:', dadosObj);
        return dadosObj;
    }

    async function saveToGoogleDrive(dados) {
        console.log('Iniciando envio para Google Drive');
        const url = 'https://script.google.com/macros/s/AKfycbzC7CYn11HzeYHkUESTXTQAfXuk44uZuDGeBy_XMN8M-adwZZIpd6aa8x555HlXp50/exec';
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Resposta do servidor:', result);
            return result;
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            throw error;
        }
    }

    function gerarPDF(dados) {
        console.log('Gerando PDF com os dados:', dados);
        // A geração do PDF agora é feita no lado do servidor (Google Apps Script)
        return Promise.resolve('PDF será gerado no servidor');
    }

    async function processFormSubmission(event) {
        event.preventDefault();
        console.log('Processando envio do formulário');

        try {
            const dados = coletarDadosFormulario();
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

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', processFormSubmission);
        console.log('Formulário configurado para envio');
    } else {
        console.error('Formulário não encontrado');
    }
});

console.log('Script carregado completamente');
