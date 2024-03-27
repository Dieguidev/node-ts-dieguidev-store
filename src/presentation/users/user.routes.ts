import { Router } from "express";
import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";



export class UserRoutes {


  static get routes(): Router {

    const router = Router();

    const userService = new UserService();

    const controller = new UserController(userService);

    // Definir las rutas
    router.get('/', controller.getAllUsers);
    router.put('/:id', controller.updateUser );
    router.delete('/:id', controller.deleteUser);
    router.get('/:id', controller.getUserById);

    // router.get('/' ,controller.getAllCategories );




    return router;
  }


}
