function findForm() {
    return document.querySelector('form') || 
           document.getElementById('preKickoffForm') || 
           document.forms[0];
}

function setupFormListener(attempts = 0) {
    console.log('Tentando configurar o listener do formulário, tentativa:', attempts);
    const form = findForm();
    if (form) {
        form.addEventListener('submit', processFormSubmission);
        console.log('Formulário configurado para envio');
    } else if (attempts < 10) {
        // Tenta novamente após 500ms, até 10 tentativas (5 segundos no total)
        setTimeout(() => setupFormListener(attempts + 1), 500);
    } else {
        console.error('Formulário não encontrado após múltiplas tentativas. Verifique se o formulário existe na página.');
    }
}

function coletarDadosFormulario() {
    console.log('Coletando dados do formulário');
    const form = findForm();
    if (!form) {
        console.error('Formulário não encontrado');
        return null;
    }
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

async function processFormSubmission(event) {
    event.preventDefault();
    console.log('Processando envio do formulário');

    try {
        const dados = coletarDadosFormulario();
        if (!dados) {
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

// Inicia o processo de configuração do listener do formulário
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando configuração do formulário');
    setupFormListener();
});

console.log('Script carregado completamente');
