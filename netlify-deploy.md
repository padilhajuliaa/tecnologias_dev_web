# Instruções para Deploy no Netlify

Este arquivo contém as instruções para fazer o build e deploy do projeto no Netlify.

## Passos para Deploy

1. Crie uma conta no Netlify (https://www.netlify.com/) caso ainda não tenha.

2. Faça o build do projeto localmente com o comando:
   ```
   npm run build
   ```

3. Para fazer o deploy manual:
   - Vá para https://app.netlify.com/
   - Arraste e solte a pasta `dist` gerada pelo build para a área de upload do Netlify.

4. Para conectar ao GitHub e fazer deploy contínuo:
   - No dashboard do Netlify, clique em "New site from Git"
   - Escolha GitHub como provedor e selecione o repositório
   - Configure as opções de build:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Clique em "Deploy site"

5. Configure o redirecionamento (isso já está configurado no arquivo netlify.toml).

6. Após o deploy, copie a URL gerada pelo Netlify e adicione-a ao arquivo netlify-url.txt para entrega.

## Configurações adicionais

- Se necessário, configure variáveis de ambiente no Netlify para as credenciais do Firebase.
- Para usar um domínio personalizado, configure-o nas configurações do site no Netlify.

## Verificação do deploy

Após o deploy, verifique se:
- A página de login está funcionando
- O cadastro de usuários está funcionando
- A autenticação e acesso à página principal estão funcionando