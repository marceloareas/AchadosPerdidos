# 🔍 Achados & Perdidos

Uma plataforma digital inteligente para registrar e recuperar objetos perdidos. O objetivo é facilitar que o dono reivindique o seu item pessoal perdido através de um sistema de "Match" automatizado por Inteligência Artificial e um chat em tempo real.

## ✨ Funcionalidades

- **Cadastro de Itens:** Registro detalhado de itens achados ou perdidos (descrição, local, categoria, data e fotos).
- **Match Inteligente (IA):** O sistema utiliza IA (LLM - embeddinggemma) para cruzar semanticamente a descrição dos itens e sugerir devoluções automaticamente, ignorando falsos positivos.
- **Chat em Tempo Real:** Comunicação via WebSockets entre os usuários que obtiveram um "match".
- **Envio de Mídia:** Câmera integrada e envio de imagens da galeria pelo chat para validação de posse.
- **Segurança e Fluxo de Devolução:** Recuperação de senha via e-mail e etapas de confirmação de devolução seguras.

## 🛠 Tecnologias Utilizadas

**Frontend:**
- React.js com Vite
- Zustand (Gerenciamento de Estado)
- SCSS (Estilização)

**Backend Principal:**
- Java 21 + Spring Boot 3
- Spring Security (JWT)
- WebSockets (STOMP) e RabbitMQ

**Inteligência Artificial (Match API):**
- Python 3.14 + Flask
- Ollama (Modelo: embeddinggemma:latest)

**Bancos de Dados:**
- PostgreSQL (Dados Relacionais: Usuários e Itens)
- MongoDB (Dados Não-Relacionais: Histórico de Chats)

## 🚀 Como rodar o projeto localmente

1. Clone o repositório.
2. Na raiz do projeto, renomeie o arquivo `.env.example` para `.env` e preencha com as suas senhas.
3. Tenha o **Docker** e o **Docker Compose** instalados na sua máquina.
4. Execute o comando abaixo na raiz do projeto:
   ```bash
   docker-compose up --build
5. Acesse o Frontend em http://localhost:5173.




### Passo 2: Arquivo `.env.example`
Crie um arquivo chamado **exatamente** `.env.example` na raiz do seu projeto (na mesma pasta onde fica o `docker-compose.yml`). Cole isso dentro dele:

```env
# ==========================================
# EXEMPLO DE VARIÁVEIS DE AMBIENTE (.env)
# ==========================================
# DICA: Copie este arquivo, renomeie para ".env" 
# e substitua os valores reais antes de rodar o Docker.

# Configurações do Banco Relacional (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=achados-perdidos
POSTGRES_USER=achados-admin
POSTGRES_PASSWORD=sua_senha_do_banco_aqui
DB_USER=achados-admin
DB_PASSWORD=sua_senha_do_banco_aqui

# Configurações do Banco NoSQL (MongoDB - Chat)
MONGO_USER=achados-perdidos
MONGO_PASSWORD=senha_segura_do_mongo

# Configurações de Segurança e Integração
SECRET=chave_secreta_jwt_gerada_aleatoriamente
MATCH_API_KEY=chave_secreta_de_integracao_java_python

# Serviço de E-mail (Gmail)
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=senha_de_aplicativo_de_16_digitos_do_google



COMO FAZER DEPLOY EM UM SERVIDOR

# 🔍 Achados & Perdidos - Guia de Deploy em Servidor Compartilhado

Este guia foi desenvolvido para orientar o deploy da aplicação em um ambiente de produção ou homologação que já possua outros sistemas em execução. A arquitetura foi projetada para evitar conflitos de portas e garantir a segurança dos dados.

## ⚠️ Cuidados em Servidores Compartilhados (Conflito de Portas)
Antes de iniciar, certifique-se com a equipe de infraestrutura de TI sobre quais portas estão livres no servidor. Se as portas padrão do projeto (5173 e 8080) já estiverem ocupadas por outros aplicativos, você deverá alterá-las no arquivo "docker-compose.yml" apenas no lado do Host (o número que fica à esquerda dos dois pontos).

Exemplo de remapeamento seguro caso haja conflito:
- Se a porta 5173 estiver ocupada, mude no compose para "8181:5173" (o mundo externo acessará via 8181).
- Se a porta 8080 estiver ocupada, mude no compose para "8082:8080" (o mundo externo acessará via 8082).

## 🚀 Passos para o Deploy

1. Clone o repositório oficial na máquina do servidor.
2. Na raiz do projeto, copie o arquivo ".env.example" criando um arquivo chamado ".env".
3. Preencha todas as variáveis de ambiente seguindo as instruções de geração de chaves.
4. Execute o comando para subir a aplicação isolando o ambiente:
   ```bash
   docker-compose up --build -d

