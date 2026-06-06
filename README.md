# Product CRUD - Sistema de Gerenciamento de Produtos

## Sobre o Projeto

Sistema completo para clientes gerenciarem seus produtos. Desenvolvido como micro-serviço com Laravel no backend e React no frontend.

### Funcionalidades

- ✅ Cadastro/Login de clientes
- ✅ CRUD completo de produtos (cada cliente só vê seus produtos)
- ✅ Área administrativa com contagem de clientes
- ✅ Documentação da API via Swagger
- ✅ Containerizado com Docker

## Tecnologias

### Backend
- Laravel 11
- MySQL 8
- Sanctum (autenticação)
- PHPUnit (testes)
- L5-Swagger

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router DOM

### Infra
- Docker & Docker Compose
- Nginx

## Como Rodar

### Pré-requisitos
- Docker e Docker Compose
- Portas 3000, 8000, 3306 disponíveis

### Passo a passo

1. Clone o repositório
```bash
git clone <seu-repositorio>
cd product-crud