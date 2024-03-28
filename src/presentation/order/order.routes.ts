import { Router } from "express";
import { OrderService } from "../services/oreder.service";
import { OrderController } from "./order.controller";




export class OrderRoutes {


  static get routes(): Router {

    const router = Router();


    const orderService = new OrderService();


    const controller = new OrderController(orderService);

    // Definir las rutas
    router.get('/', controller.getAllOrders);
    router.get('/:id', controller.getById);
    router.post('/', controller.createOrder );
    router.post('/add-product', controller.addProductToOrder)
    // router.put('/:id', controller.updateCustomer );

    // router.get('/validate-email/:token', controller.validateEmail );




    return router;
  }


}
