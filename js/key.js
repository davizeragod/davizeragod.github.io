function setLanguage(language) {
    document.body.style.opacity = 0;

    setTimeout(function () {
        const texts = {
            'pt': {
                'step1': 'Passo 1: Junte-se ao servidor do Discord da API',
                'step2': 'Passo 2: Verifique seu usuário',
                'step3': 'Passo 3: Vá para o canal #Get-a-key',
                'step4': 'Passo 4: Clique em Generate',
                'step5': 'Passo 5: Selecione a opção Valorant',
                'step6': 'Passo 6: Selecione a opção Basic Key',
                'step7': 'Passo 7: Preencha o formulário como o exemplo abaixo:',
                'step8': 'Passo 8: Você receberá sua API Key em uma MD no seu Discord',
                'step9': 'Passo 9: Use a chave gerada na página da Overlay'
            },
            'en': {
                'step1': 'Step 1: Join the API Discord Server',
                'step2': 'Step 2: Verify Your User',
                'step3': 'Step 3: Go to the #Get-a-key Channel',
                'step4': 'Step 4: Click Generate',
                'step5': 'Step 5: Select Valorant',
                'step6': 'Step 6: Select Basic Key',
                'step7': 'Step 7: Fill the form as the following example and press "Send"',
                'step8': 'Step 8: You will receive your API key on your Discord DMs',
                'step9': 'Step 9: Use the generated key on the overlay page'
            },
            'jp': {
                'step1': 'ステップ1：APIのDiscordサーバーに参加する',
                'step2': 'ステップ2：ユーザーを確認する',
                'step3': 'ステップ3： #Get-a-keyチャンネルに移動する',
                'step4': 'ステップ4: Generateをクリックして',
                'step5': 'ステップ5: Valorantをクリックして',
                'step6': 'ステップ6: Basic Keyをクリックして',
                'step7': 'ステップ7: 以下の例のようにフォームに記入し、送信を押してください',
                'step8': 'ステップ8: APIキーはDiscordのDMで受け取ります',
                'step9': 'ステップ9: 生成されたキーをオーバーレイ・ページで使用する'
            }
        };

        const instructions = {
            'pt': {
                'step1': '<a href="https://discord.gg/X3GaVkX2YN" target="_blank" rel="noopener">Clique aqui para entrar no servidor do Discord</a>',
                'step2': 'Complete o captcha no canal #Verify para verificar seu usuário.',
                'step3': 'Localize o canal #Get-a-key no servidor do Discord.',
                'step4': '',
                'step5': '',
                'step6': '',
                'step7': '',
                'step8': '',
                'step9': ''
            },
            'en': {
                'step1': '<a href="https://discord.gg/X3GaVkX2YN" target="_blank" rel="noopener">Click here to join the Discord server</a>',
                'step2': 'Complete the captcha on the #Verify channel to verify your user.',
                'step3': 'Locate the #Get-a-key channel in the Discord server.',
                'step4': '',
                'step5': '',
                'step6': '',
                'step7': '',
                'step8': '',
                'step9': ''
            },
            'jp': {
                'step1': '<a href="https://discord.gg/X3GaVkX2YN" target="_blank" rel="noopener">Discordサーバーへの参加はこちら</a>',
                'step2': '#Verifyチャンネルでキャプチャを完了して、ユーザーを確認します。',
                'step3': 'Discordサーバーの＃Get-a-keyチャンネルを見つけます。',
                'step4': '',
                'step5': '',
                'step6': '',
                'step7': '',
                'step8': '',
                'step9': ''
            }
        };

        const steps = document.querySelectorAll('.step');

        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.querySelector(`h2`).textContent = texts[language][`step${stepNumber}`];
            step.querySelector(`p`).innerHTML = instructions[language][`step${stepNumber}`];
            if (stepNumber > 3){
            const image = step.querySelector(`img`);
            image.src = "./img/"+stepNumber + ".png";
            image.alt = `Step ${stepNumber}`;}
        });

        document.querySelector('.language-container').style.display = 'none';
        document.querySelector('.guide-container').style.display = 'block';
        document.body.style.opacity = 1;
    }, 1000);
}