# ImobiAI - Sistema de Avaliação Imobiliária

Sistema de avaliação imobiliária automatizada usando a API da Perplexity AI para gerar análises profissionais de imóveis.

## Funcionalidades

- 🏠 Avaliação automatizada de imóveis
- 🔒 Sistema de autenticação completo
- 📊 Análise detalhada com IA
- 📱 Interface responsiva e moderna
- 📝 Histórico de avaliações

## Tecnologias

- Next.js 14
- TypeScript
- Prisma (PostgreSQL)
- Tailwind CSS
- API da Perplexity
- JWT para autenticação

## Instalação

1. Clone o repositório:
```bash
git clone https://seu-repositorio/imobiai.git
cd imobiai
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Configure o banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Configuração do Ambiente

Você precisará das seguintes variáveis de ambiente:

- `DATABASE_URL`: URL de conexão com o PostgreSQL
- `JWT_SECRET`: Chave secreta para geração de tokens JWT
- `PERPLEXITY_API_KEY`: Chave de API da Perplexity AI
- `NODE_ENV`: Ambiente de execução (development/production)

## Uso

1. Acesse `http://localhost:3000`
2. Crie uma conta ou faça login
3. No dashboard, preencha os dados do imóvel
4. Receba uma avaliação detalhada gerada por IA

## Estrutura do Projeto

```
imobiai/
├── app/                    # Rotas e componentes Next.js
│   ├── api/               # API routes
│   ├── dashboard/         # Página do dashboard
│   ├── login/            # Página de login
│   └── register/         # Página de registro
├── prisma/                # Configuração do Prisma
└── public/                # Arquivos estáticos
```

## Segurança

- Autenticação via JWT
- Senhas criptografadas com bcrypt
- Proteção contra CSRF
- Validação de dados
- Cookies HttpOnly

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
