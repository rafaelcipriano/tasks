# Tasks
## Sobre

Uma API para um sistema Gerenciador de tarefas, onde os usuários podem criar contas, autenticar-se e gerenciar tarefas. As tarefas podem ser atribuídas a membros do time, categorizadas por status e prioridade, e acompanhadas.

[!Esquema do banco de dados](api-schema.png)

### Como inicializar a api

Instale as dependências do projeto com o comando: `npm install`.

Inicialize a imagem do PostgreSQL com o docker utilizando o comando: `docker-compose up -d`.

Inicie o banco de dados com o comando: `npx prisma migrate dev --name init`.

Inicie o servidor com o comando: `npm run dev`.

### Insomnia
Importe o arquivo `insomnia-routes.yaml` para o insomnia e teste as rotas como quiser, lembre-se de verificar se o "Base Environment" está selecionado com a opção "dev", para utilizar as rotas do ambiente de desenvolvimento.

## Rotas

### /user
__Create__
* _Method_: `POST`
```json
{
    "name": "John",
    "email": "john@example.com",
    "password": "123456"
}
```
* _Retorno_: Exibe os dados do usuário cadastrado.

__Index__
* _Method_: `GET`
* _Retorno_: Exibe todos os usuários cadastrados.

__Update__
* _Method_: `PATCH`
* _Route_: `user/userId`
```json
{
    "name": "John Doe", //Opcional
    "email": "johndoe@example.com" //Opcional
}
```
* _Retorno_: Exibe os dados do usuário selecionado com as informações atualizadas.

__Update Password__
* _Method_: `PUT`
* _Route_: `userId/update-password`
```json
{
    "old_password": "123456",
    "new_password": "123456"
}
```
* _Retorno_: Um messagem informando que a senha foi atualizada com sucesso.

__Delete__
* _Method_: `DELETE`
* _Route_: `user/userId`
```json
{
    "password": "123456"
}
```
* _Retorno_: Exibe os dados do usuário deletado.

## /session
__Create__
* _Method_: `POST`
```json
{
    "name": "johndoe@example.com",
    "password": "123456"
}
```
* _Retorno_: Exibe um objeto com um token gerado pelo Json Web Token e os dados do usuário que realizou login na sessão.

## /teams
As funcionalidades dessa rota, só podem ser executadas somente se o usuário que realizou login em `/session` possuir o `role` definido como `ADMIN`. Para fornecer previlégios de administrador para um usuário, altere a `role` diretamente no banco de dados.

__Create__
* _Method_: `POST`
```json
{
    "name": "Alpha",
    "description": "Give some description about the team."
}
```
* _Retorno_: Exibe os dados do time criado.

__Index__
* _Method_: `GET`
* _Retorno_: Exibe todos os times cadastrados.

__Update__
* _Method_: `PATCH`
* _Route_: `teams/teamId`
```json
{
    "name": "Bravo", //Opcional
    "description": "Give a new description to the team." //Opcional
}
```
* _Retorno_: Exibe as informações atualizada do time selecionado.

__Delete__
* _Method_: `DELETE`
* _Route_: `teams/teamId`
* _Retorno_: Exibe os dados do time deletado.

## /team-members
As funcionalidades dessa rota, só podem ser executadas somente se o usuário que realizou login em `/session` possuir o `role` definido como `ADMIN`. Para fornecer previlégios de administrador para um usuário, altere a `role` diretamente no banco de dados.

__Add Members__
* _Method_: `POST`
* _Route_: `team-members/teamId?memberId=memberId`
* _Retorno_: Devolve um status code `201 Created`.

__Show Members__
* _Method_: `GET`
* _Route_: `team-members/teamId`
* _Retorno_: Exibe o time selecionado, e os membros desse time.

__Delete Member__
* _Method_: `DELETE`
* _Route_: `team-members/teamId/delete-member?memberId=memberId`
* _Retorno_: Exibe um status code de 200, informando que a ação foi um sucesso.

__Delete All Members__
* _Method_: `DELETE`
* _Route_: `team-members/teamId/delete-all-members`
* _Retorno_: Exibe a quantidade de membros removidos do time.

### /tasks

__Create__
* _Method_: `POST`
```json
{
    "title": "Arquivar a documentação do escritório",
    "description": "Separar a documentação do departamento em ordem alfabética e arquivar.",
    "priority": "LOW | MEDIUM | HIGH", //Default: LOW
    "assignedTo": 3, //ID de um membro do time
    "teamId": 1 //ID do time responsável pela tarefa
}
```
* _Retorno_: Exibe os dados da tarefa.

__Index__
* _Method_: `GET`
* _Retorno_: Exibe todas as tarefas criadas.

__Show__
* _Method_: `GET`
* _Route_: tasks/taskId
* _Retorno_: Exibe a tarefa informada como `RouteParam`

__Update Status__
* _Method_: `PUT`
* _Route_: `tasks/taskId?memberId=memberId`
```json
{
    "newStatus": "pending | in_progress | completed"
}
```

__Delete__
* _Method_: `DELETE`
* _Route_: `tasks/taskId`
* _Retorno_: Exibe a tarefa que foi deletada.