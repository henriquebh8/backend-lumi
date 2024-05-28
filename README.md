# Projeto de Gestão de Faturas

Este projeto foi desenvolvido para proporcionar um ambiente que funcione em qualquer máquina utilizando Docker.  
A aplicação permite a gestão de faturas, incluindo upload, processamento e visualização de dados extraídos de PDFs de faturas.

## Tecnologias Utilizadas

- Docker
- PostgreSQL
- Prisma
- Express
- dotenv
- multer
- pdf-parse
- TypeScript
- Jest

## Preparação do Ambiente

### Passos Iniciais

1. Dê permissões aos arquivos `wait-for-it.sh` e `run.sh`:
   
`chmod +x wait-for-it.sh run.sh`

2. Para iniciar a aplicação, rode o seguinte comando:

`docker-compose up --build`

Caso apresente qualquer erro, utilize o script run.sh:

`./run.sh`


## Estrutura do Projeto
Diretório src
controller/invoiceController.ts: Controlador responsável pelas operações relacionadas às faturas.
services/invoiceService.ts: Serviço que lida com a lógica de negócios e interações com o banco de dados.
utils/extractorPDF.ts: Utilitário para extração de dados de PDFs.
interfaces/invoice.interface.ts: Interface que define a estrutura de uma fatura.
routes/invoiceRoutes.ts: Define as rotas da API para a gestão de faturas.
Diretório scripts
wait-for-it.sh: Script para garantir que o banco de dados esteja pronto antes de iniciar a aplicação.
run.sh: Script para rodar comandos necessários para a inicialização do ambiente.
Configuração do Docker
O docker-compose.yml define os serviços da aplicação, incluindo o banco de dados PostgreSQL e a aplicação Node.js.

Configuração do Prisma
O Prisma é utilizado como ORM para interagir com o banco de dados PostgreSQL. A configuração do Prisma está definida no arquivo prisma/schema.prisma.

Rotas da API
GET /invoices
Retorna todas as faturas.

GET /invoices/:id
Retorna uma fatura específica pelo ID.

POST /upload
Faz o upload de um arquivo PDF e processa a fatura.

GET /invoices/:id/pdf
Retorna o caminho do arquivo PDF de uma fatura específica.

DELETE /invoices/:id
Deleta uma fatura específica pelo ID.

# Testes
npm test
