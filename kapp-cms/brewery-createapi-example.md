## {#create-new-application}

# Creating your first API

## Setup

First, you’ll need to install a supported version of Node:

- [Node.js](https://nodejs.org/en/) at v8.9 or greater
- We recommend to use [NVM](https://github.com/nvm-sh/nvm) \(node version manager\)

Additionally, this guide assumes that you are comfortable with certain technologies, languages and concepts.

- JavaScript \(ES6\)
- [REST](http://www.restapitutorial.com/lessons/whatisrest.html)

Lastly, you’ll need to install the Brewery CLI toolkit:

```
npm i -g @brewery/cli
```

## Create a new project

To create a new project, use brewery init command and finish through the init wizard

```
$ brewery init

                                                                          .   *   ..  . *  *
                                                                          *  * @()Ooc()*   o  .
/$$$$$$$                                                                    (Q@*0CG*O()  ___
| $$__  $$                                                                  |\_________/|/ _ \
| $$  \ $$  /$$$$$$   /$$$$$$  /$$  /$$  /$$  /$$$$$$   /$$$$$$  /$$   /$$  |  |  |  |  | / | |
| $$$$$$$  /$$__  $$ /$$__  $$| $$ | $$ | $$ /$$__  $$ /$$__  $$| $$  | $$  |  |  |  |  | | | |
| $$__  $$| $$  \__/| $$$$$$$$| $$ | $$ | $$| $$$$$$$$| $$  \__/| $$  | $$  |  |  |  |  | | | |
| $$  \ $$| $$      | $$_____/| $$ | $$ | $$| $$_____/| $$      | $$  | $$  |  |  |  |  | | | |
| $$$$$$$/| $$      |  $$$$$$$|  $$$$$/$$$$/|  $$$$$$$| $$      |  $$$$$$$  |  |  |  |  | | | |
|_______/ |__/       \_______/ \_____/\___/  \_______/|__/       \____  $$  |  |  |  |  | \_| |
                                                                 /$$  | $$  |  |  |  |  |\___/
Brewery version 1.0.4                                           |  $$$$$$/  |\_|__|__|_/|
Stratpoint Technologies Inc.                                     \______/    \_________/

? brewery username: username@brewery.com
? password: [hidden]
Login successful! Cheers! Welcome to the Brewery!
? Choose project type: backend-nodejs
? App name: getting-started
? Description: Getting started tutorial
Brewing project...
Downloading archive...
Download Success!
Decompressing archive...
Decompress success!
Installing dependencies...
Brewing success!
Starting app...
```

## Create your domain Entity \(`domain`folder\)

You may create your domain entities, value objects manually or using the CLI. For this example, we will create a "User" domain entity

```
$ brewery create:domain User
User.js created on src/domain
```

This command will generate the following code:

```
const { attributes } = require('structure');

const User = attributes({
  // Add atttributes here
  // id: Number,
  // name: String,
  // createdAt: Date,
  // updatedAt: Date,
})(class User {
  // Add validation functions below
  // e.g.:
  //
  // isLegal() {
  //   return this.age >= User.MIN_LEGAL_AGE;
  // }
});

// Add constants below
// e.g.:
//
// User.MIN_LEGAL_AGE = 21;

module.exports = User;
```

Brewery uses [Structure](https://structure.js.org/) for its Domain entities and value objects definition.

Here you'll define your business domain classes, functions, and services that compose your [domain model](https://martinfowler.com/eaaCatalog/domainModel.html). All your business rules should be declared in this layer so the application layer can use it to compose your use cases.

for this tutorial. Let us edit the **User.js **file and add some attributes to our user entity

```
const { attributes } = require('structure');

const User = attributes({
  // Add atttributes here
  id: Number,
  firstName: String,
  lastName: String,
  middleName: String,
  createdAt: Date,
  updatedAt: Date,
})(class User {
});


module.exports = User;
```

## Create your Use Cases \(`app`folder\)

Let's say we want to create a use case for the "User" domain entity we have just created, to do this we may use the following command to generate the template.

```
$ brewery create:appservice <name>
```

It will generate the **CreateUser.js** file with the following code on our src/app directory.

```
const { Operation } = require('@brewery/core');

class CreateUser extends Operation {
  constructor({ }) {
    super();
  }

  async execute(data) {
    /**
     * Implement service/usecase logic here. eg:
     *
     * const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
     *
     * const user = new User(data);
     *
     *  try {
     *     const newUser = await this.UserRepository.add(user);
     *
     *     this.emit(SUCCESS, newUser);
     *   } catch(error) {
     *     if(error.message === 'ValidationError') {
     *       return this.emit(VALIDATION_ERROR, error);
     *     }
     *     this.emit(ERROR, error);
     *   }
     */
  }
}

CreateUser.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateUser;
```

We can uncomment the execute method code of CreateUser class to implement the **CreateUser** use case. The **Operation **class extended by **CreateUser **class uses the **EventEmitter** module. The standard `this` keyword is intentionally set to reference the`EventEmitter`instance to which the listener is attached.

```
class CreateUser extends Operation
```

There are three pre-defined events for CreateUser class \(SUCCESS, ERROR, VALIDATION_ERROR\). The Interface and Infrastructure layer may use and listen to these events in order to interact with the application\(app\) layer.

To complete our CRUD use cases, let us create the use cases for **CreateUser,** **UpdateUser**, **DeleteUser**, **ListUsers** and **ShowUses**.

**src/app/CreateUser.js**

```
const { Operation } = require('@brewery/core');
const User = require('src/domain/User');

class CreateUser extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    const user = new User(data);

    try {
      const newUser = await this.UserRepository.add(user);

      this.emit(SUCCESS, newUser);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateUser.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateUser;
```

**src/app/UpdateUser.js**

```
const { Operation } = require('@brewery/core');

class UpdateUser extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR
    } = this.events;

    try {
      const user = await this.UserRepository.update(id, data);
      this.emit(SUCCESS, user);
    } catch(error) {
      switch(error.message) {
      case 'ValidationError':
        return this.emit(VALIDATION_ERROR, error);
      case 'NotFoundError':
        return this.emit(NOT_FOUND, error);
      default:
        this.emit(ERROR, error);
      }
    }
  }
}

UpdateUser.setEvents(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = UpdateUser;
```

**src/app/DeleteUser.js**

```
const { Operation } = require('@brewery/core');

class DeleteUser extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(id) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.events;

    try {
      await this.UserRepository.remove(id);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteUser.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = DeleteUser;
```

**src/app/ShowUser.js**

```
const { Operation } = require('@brewery/core');

class ShowUser extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const user = await this.UserRepository.getById(id);
      this.emit(SUCCESS, user);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

ShowUser.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ShowUser;
```

**src/app/ListUsers.js**

```
const { Operation } = require('@brewery/core');

class ListUsers extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.events;

    try {
      const users = await this.UserRepository.getAll({});

      this.emit(SUCCESS, users);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

ListUsers.setEvents(['SUCCESS', 'ERROR']);

module.exports = ListUsers;
```

## Create a Datasource \(`infra`folder\)

In order for us to persist our data, we must create a Datasource that our infra models would use to interact with datastores such as **relational **or **NoSQL **databases. We may use the `brewery create:datasource` command to help us with that.

```
$ brewery create:datasource
? Datasource name: db
? Connector: sql
? host: 127.0.0.1
? username: root
? password: [hidden]
? database: yourdatabase
? dialect: mysql
? Sync models to database?: Yes
? Install brewery-sql-connector ?: Yes
? Install mysql ?: Yes
```

- **Datasource name:** The name that will identify your datasource
- **Connector:** the adapter that brewery framework will use to interact with your datastore \(eg. sql, nosql\)\(only sql adapter is supported for now\)
- **host: **the host for your database
- **username:** username credential to be used to access database
- **password**: password to be used to access your database
- **database:** the name of the database to be used
- **dialect:** database dialect to be used \(eg. mysql, postgres, mssql, mariadb, sqlite\)
- **Sync models to database:** boolean configuration on whether infra model definition changes should be synced to database \(recommended to be used only on dev phase, production environments should use migration scripts\)
- **Install brewery-sql-connector?**: this will be prompted if you choose sql connector. Additional packages will be installed
- **Install mysql?**: prompt if mysql driver should be installed \(required for this case\)

At the end of the datasource wizard, a **Db.js**\(filename will depend on datasource name\)\*\* \*\*file will be generated on src/infra/dataSources directory.

**src/infra/dataSources/Db.js**

```
module.exports = {
  name: 'db',
  connector : 'sql',
  config: {
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'yourdatabase',
    dialect: 'mysql',
    isSync: 'true',

  }
};
```

## Create a Model \(`infra`folder\)

We will now create a **Model **that will serve as Object Relation Mapper \(ORM\) to our Datasources. We may use the `brewery create:model` command to help us with that.

```
$ brewery create:model
? Model Name: user
? Datasource: db
? Primary Key Name: id
? Primary Key DataType: INTEGER
Add attributes....
? Attribute Name: firstName
? DataType: STRING
? Add another attribute?: Yes
? Attribute Name: lastName
? DataType: STRING
? Add another attribute?: Yes
? Attribute Name: middleName
? DataType: STRING
? Add another attribute?: No
UserModel.js created on src/infra/models
```

At the end of the create:model wizard, a **UserModel.js**\(filename will depend on model name\)\*\* \*\*file will be generated on src/infra/models directory.

```
module.exports = {
  name: 'UserModel',
  datasource: 'db',
  definition: function(datasource, DataTypes) {
    const UserModel = datasource.define('UserModel', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      firstName : {
        type: DataTypes.STRING
      },lastName : {
        type: DataTypes.STRING
      },middleName : {
        type: DataTypes.STRING
      },
    }, {
      tableName: 'users',
      timestamps: true
    });

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  UserModel.associate = function () {
     *   UserModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return UserModel;
  }
};
```

The Brewery framework uses [**Sequelize v5**](https://sequelize.org/master/) as its **SQL adapter**. You may refer to the sequelize v5 documentation for detailed reference for your model definitions, usages and queries.

## Create a Repository \(`infra`folder\)

The Brewery framework uses repository pattern in order for our use cases to interact with our datasources. Instead of using our models directly, we created a repository class with its methods that will serve as our reusable queries in our usecases\(app layer\). We may use the `brewery create:repository` command to help us with that.

```
$ brewery create:repository
? Repository name: user
? Extend BaseRepository(CRUD) class:  Yes
UserRepository.js created on src/infra/repositories
```

This will generate a **UserRepository.js **file with the following code:

```
const { BaseRepository } = require('@brewery/core');

class UserRepository extends BaseRepository {
  constructor({ UserModel }) {
    super(UserModel);
  }
}

module.exports = UserRepository;
```

Extending the **BaseRepository** requires the model to be used for this repository, in this case, our UserModel. Upon extending the **BaseRepository** class, the **UserRepository** inherits the following methods:

- getAll\(args\)
  - args: sequelize query/usage arguments
- getById\(id\)
  - id: identifier of the entity to be retrieved
- add\(entity\)
  - entity: data of the entity to be created
- remove\(id\)
  - id: identifier of the entity to be removed
- update\(id, newData\)
  - id: identifier of the entity to be updated
  - newData: updated data of the entity
- count\(\)
  - returns the current number of records saved for the model

The methods above returns a Promise that you can consume on your use cases.

You may also define your own methods or override existing methods.

## Create an API Resource \(`interface`folder\)

In order for other services or clients to access our backend service we must create an interface that they could use to interact with, in this case a **REST API**.

The Brewery Framework uses ExpressJS to manage everything from building routes to handle requests. By default, a router.js file is already created at** src/interfaces/https** directory, you may create your controllers at** src/interfaces/https/controllers **directory and your **middlewares **at **src/interfaces/https/middleware. **

Instead of writing the code necessary to build an API Resource manually, you may use the `brewery create:apiresource`\*\* \*\*command to get started.

```
$ brewery create:apiresource
? Route name: users
? Controller name(Automatically Suffixed with 'Controller'): users
? Extend Base Controller(CRUD) class?: Yes
UsersController.js created on src/interfaces/http/controllers
route users created on src/interfaces/http/router.js
```

This will generate a **UsersController.js **file on **src/interfaces/http/controllers **with the following code:

```
const { Router } = require('express');
const { BaseController } = require('@brewery/core');

class UsersController extends BaseController {

  constructor() {
    super();
    const router = Router();
    // router.get('/', this.injector('ListUsers'), this.index);
    // router.post('/', this.injector('CreateUser'), this.create);
    // router.get('/:id', this.injector('ShowUser'), this.show);
    // router.put('/:id', this.injector('UpdateUser'), this.update);
    // router.delete('/:id', this.injector('DeleteUser'), this.delete);

    return router;
  }

  /**
   * CRUD sample implementation
   * You may delete the commented code below if you have extended BaseController class
   * The following methods are already inherited upon extending BaseController class from @brewery/core
   */

  // index(req, res, next) {
  //   const { operation } = req;
  //   const { SUCCESS, ERROR } = operation.events;

  //   operation
  //     .on(SUCCESS, (result) => {
  //       res
  //         .status(Status.OK)
  //         .json(result);
  //     })
  //     .on(ERROR, next);

  //   operation.execute();
  // }
  ...........
}

module.exports = UsersController;
```

The generated code includes a sample CRUD implementation methods.You could choose to delete these methods since the UserController has already inherited these methods from the BaseController class. Uncomment the route declarations and edit as it fits your needs.

You may use the injector method to inject classes from the dependency injection container to the **req **parameter as **operation **as show on the code below

```
router.get('/', this.injector('ListUsers'), this.index);
```

or you could use the dependency container itself, accessible through **req.container** and resolve the use case classes you need as shown below

```
const operation = req.container.resolve('ListUsers');
```

This is possible through the usage of **containerMiddleware **that is registered by default on **src/interfaces/http/router.js**

> ```
> router.use(containerMiddleware);
> ```

From the **Create your Use Cases **section, we could listen to the events of **use case\(app\) classes** to interact with it.

```
const { SUCCESS, ERROR } = operation.events;

     operation
       .on(SUCCESS, (result) => {
         res
           .status(Status.OK)
           .json(result);
       })
       .on(ERROR, next);

     operation.execute();
```

The `brewery create:apiresource` command has also added the user routes on **src/interfaces/http/router.js**

```
apiRouter.use('/users', controller('controllers/UsersController.js'));
```

## Testing the API

Your now have a working CRUD API. From your console, execute `npm run dev` and in a browser, you may visit [http://127.0.0.1:3000](http://127.0.0.1:3000/ping). Or you may use use cURL, [Postman](https://www.getpostman.com/) or any other REST client tool.

You may now test the following API's

- GET /users
- GET /users/{id}
- POST /users
  - body \(application/json\) :
    - ```
      {
          "firstName": "John",
          "lastName" : "Doe",
          "middleName": "Moe"
      }
      ```
- PUT /users/{id}

  - body\(application/json\)

    - ```
      {
          "firstName": "Josh",
          "lastName" : "Mante",
          "middleName": "Tisbe"
      }
      ```

- DELETE /users/{id}
