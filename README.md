<div align="center">

<h1>
  CosmosDB CRUD App<br/><br/>
  <img src="https://azure.microsoft.com/svghandler/cosmos-db?width=600&height=315" height=70 />
</h1>

<p>Typescript app with CosmosDB.</p>
</div>

---

## :information_source: Como usar

```bash
# Clone este repositório
$ git clone https://github.com/joaovictornsv/cosmosdb-crud

# Entre na pasta do repositório
$ cd cosmosdb-crud

# Instale as dependências
$ yarn install

# Inicie o servidor
$ yarn dev
```

---

## :arrow_right_hook: Rotas

<details>
    <summary>
        Ver rotas
    </summary>

<br/>

![](https://img.shields.io/badge/get-BD93F9.svg?&style=for-the-badge&logoColor=white)

- Get all users

```
/users
```

- Get a specific user
```
/users/:id
```

---

![](https://img.shields.io/badge/post-49F37B.svg?&style=for-the-badge&logoColor=white)
- Create a user

```
/users
```
Request Body:
```
{
  "name":
  "email":
}
```


![](https://img.shields.io/badge/put-FFB86C.svg?&style=for-the-badge&logoColor=white)
- Update a user

```
users/:id
```
Request Body:
```
{
  "name":
  "email":
}
```

---

![](https://img.shields.io/badge/delete-FF4D4B.svg?&style=for-the-badge&logoColor=white)

- Delete a user

```
/users/:id
```
</details>
    
---

<div>
  <img align="left" src="https://i.imgur.com/ufUYAFh.png" width=35 alt="Profile"/>
  <sub>Made with 💙 by <a href="https://github.com/joaovictornsv">João Victor</a></sub>
</div>
