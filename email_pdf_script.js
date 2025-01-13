document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado');

    function collectFormData() {
        console.log('Coletando dados do formulário');
        const formData = {};
        document.querySelectorAll('input, textarea, select').forEach((element) => {
            if (element.type === 'checkbox') {
                if (!formData[element.name]) {
                    formData[element.name] = [];
                }
                if (element.checked) {
                    formData[element.name].push(element.value);
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else {
                formData[element.name] = element.value;
            }
        });
        console.log('Dados coletados:', formData);
        return formData;
    }

    function saveToGoogleDrive(formData) {
        console.log('Iniciando envio para Google Drive');
        fetch('https://script.google.com/macros/s/AKfycbyPAXGBlDVH8fW9qLC4xB5b1xl-dVl3V7b-zRLJzMONUjm9unvE1Oa4ASYz_1uD49ICYg/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            console.log('Resposta recebida:', response);
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados processados:', data);
            if (data.result === 'success') {
                console.log('Formulário processado com sucesso:', data);
                renderSuccessPage();
            } else {
                console.error('Erro ao processar o formulário:', data.error);
                alert('Ocorreu um erro ao processar o formulário. Por favor, tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
        });
    }

    function renderSuccessPage() {
        console.log('Renderizando página de sucesso');
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-4">Formulário enviado com sucesso!</h2>
                <p class="text-lg text-green-600">Obrigado por preencher o formulário. Um e-mail de confirmação foi enviado para você.</p>
            </div>
        `;
    }

    function processFormSubmission(event) {
        event.preventDefault();
        console.log('Processando envio do formulário');
        const formData = collectFormData();
        saveToGoogleDrive(formData);
    }

    // Função para adicionar o evento de clique ao botão Finalizar
    function addFinalizeButtonListener() {
        const finalizeButton = document.getElementById('finalize');
        if (finalizeButton) {
            console.log('Botão Finalizar encontrado');
            finalizeButton.addEventListener('click', processFormSubmission);
        } else {
            console.error('Botão Finalizar não encontrado');
        }
    }

    // Observador de mutação para detectar quando o botão Finalizar é adicionado ao DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const finalizeButton = document.getElementById('finalize');
                if (finalizeButton) {
                    addFinalizeButtonListener();
                    observer.disconnect(); // Para de observar após encontrar o botão
                }
            }
        });
    });

    // Configuração do observador
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    console.log('Script carregado completamente');
});