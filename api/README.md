# UniBuilds API 🏆

API REST para o aplicativo mobile **UniBuilds** — gerenciador de builds para League of Legends.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Linguagem | TypeScript |
| Banco de Dados | MySQL |
| Driver BD | mysql2 |

## Estrutura do Projeto

```
api/
├── src/
│   ├── config/
│   │   └── database.ts       # Pool de conexão MySQL
│   ├── types/
│   │   └── index.ts          # Interfaces TypeScript
│   ├── models/
│   │   ├── CampeaoModel.ts   # Queries de campeões, habilidades e skins
│   │   ├── ItemModel.ts      # Queries de itens
│   │   ├── RunaModel.ts      # Queries de runas (com agrupamento por árvore)
│   │   └── BuildModel.ts     # Queries de builds (com JOINs)
│   ├── controllers/
│   │   ├── CampeaoController.ts
│   │   ├── ItemController.ts
│   │   ├── RunaController.ts
│   │   └── BuildController.ts
│   ├── routes/
│   │   ├── championRoutes.ts
│   │   ├── itemRoutes.ts
│   │   ├── runeRoutes.ts
│   │   └── buildRoutes.ts
│   ├── app.ts                # Configuração do Express + middlewares
│   └── server.ts             # Ponto de entrada (testa BD e sobe servidor)
├── .env                      # Variáveis de ambiente (não commitar!)
├── .env.example              # Template de variáveis de ambiente
├── package.json
└── tsconfig.json
```

## Configuração

### 1. Banco de Dados
Importe o arquivo `league_of_legends.sql` no seu MySQL:
```bash
mysql -u root -p league_of_legends < ../league_of_legends.sql
```

### 2. Variáveis de Ambiente
Edite o arquivo `.env` com suas credenciais:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha_aqui
DB_NAME=league_of_legends
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Iniciar em Desenvolvimento
```bash
npm run dev
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check da API |
| `GET` | `/api/champions` | Lista todos os campeões |
| `GET` | `/api/champions/:id` | Detalhes + habilidades + skins |
| `GET` | `/api/items` | Lista todos os itens |
| `GET` | `/api/items/:id` | Detalhes de um item |
| `GET` | `/api/runes` | Runas agrupadas por árvore |
| `POST` | `/api/builds` | Cria uma nova build |
| `GET` | `/api/builds/user/:userId` | Builds de um usuário |

## Exemplos de Uso

### Criar uma Build
```bash
POST http://localhost:3000/api/builds
Content-Type: application/json

{
  "userId": "user_expo_123",
  "championId": 1,
  "items": [3031, 3046, 6333],
  "bootId": "3006",
  "spell1Id": 4,
  "spell2Id": 11,
  "runes": [8010, 9111, 9104, 8014]
}
```

### Buscar Campeão
```bash
GET http://localhost:3000/api/champions/1
```

### Listar Runas por Árvore
```bash
GET http://localhost:3000/api/runes
```

## Histórico de Atualizações (Backend & BD)

- **Isolamento de Contas:** Adicionada coluna `user_nome` na tabela de banco de dados `builds` para permitir que cada usuário filtre e salve builds exclusivas de sua conta sem ocorrer sobreposição de dados.
- **Autenticação Conectada:** A controladora `UserController` agora se comunica de fato com o banco de dados Aiven MySQL e barra nomes já em uso.
- **Integração Real:** Todas as requisições (como GET Campeões, GET Runas e GET Itens) foram parametrizadas para puxar as tabelas dinamicamente, permitindo atualizações de patch sem trocar o código da API.
