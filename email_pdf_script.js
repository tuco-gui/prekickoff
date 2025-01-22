console.log('Script iniciando...');

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
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            console.log('Resposta recebida:', response);
            return { status: "success", message: "Formulário enviado com sucesso" };
        } catch (error) {
            console.error('Erro detalhado ao enviar os dados:', error);
            throw error;
        }
    }

    async function processFormSubmission(event) {
        console.log('Função processFormSubmission chamada');
        if (event) {
            event.preventDefault();
            console.log('Evento padrão prevenido');
        }

        try {
            const dados = coletarDadosFormulario();
            if (!dados || Object.keys(dados).length === 0) {
                throw new Error('Falha ao coletar dados do formulário');
            }
            console.log('Dados coletados com sucesso:', dados);

            console.log('Iniciando saveToGoogleDrive');
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
        console.log('Botão de finalizar encontrado, adicionando listener');
        finalizarButton.addEventListener('click', processFormSubmission);
    } else {
        console.error('Botão de finalizar não encontrado');
    }
});

console.log('Script carregado completamente');
