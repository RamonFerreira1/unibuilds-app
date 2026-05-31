# UniBuilds - Frontend 📱

Aplicativo mobile e web do **UniBuilds**, construído com React Native e Expo. Esta é a camada de visão (View) do gerenciador de builds para League of Legends, responsável por fornecer uma interface rica, dinâmica e fácil de usar.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native (Expo) |
| Web Bundler | Metro Bundler |
| Gerenciador de Estado | Zustand |
| Navegação | React Navigation |
| Requisições | Fetch API (nativo) |

## Como rodar o projeto

### 1. Instalar dependências
No diretório `unibuilds`, rode o comando:
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento do Expo
Para iniciar no modo de visualização local:
```bash
npm start
```
Após o servidor ligar, você pode pressionar `w` no terminal para abrir o aplicativo diretamente no navegador web.

## Histórico de Atualizações (Frontend)

- **Tratamento de Erros e UI:** Implementado botões de "Tentar Novamente" e telas de erro caso a API falhe ao entregar listas de itens/campeões na tela de criação de build.
- **Sanitização de Nomes (UX):** Removida a exibição de lixo XML e tags HTML dos nomes dos itens (`<rarityLegendary>`) melhorando a visualização e os algoritmos da barra de busca do modal.
- **Prevenção de Duplo-Clique:** Adicionado `ActivityIndicator` nos fluxos de Cadastrar, Logar e Salvar Build/Deletar Build, blindando a interface contra bugs de concorrência gerados por toques apressados do usuário.
- **Auto-Reset (UX):** O formulário complexo de builds é limpo de forma instantânea e autônoma logo após a confirmação de que a build foi salva com sucesso no banco.
- **Hospedagem em Produção:** Adaptada configuração de resolução de módulos (Zustand + import.meta) permitindo a exportação limpa do Web Build do Expo via Vercel.
