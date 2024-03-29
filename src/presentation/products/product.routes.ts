import { Router } from "express";
import { ProductService } from "../services/product.service";
import { ProductController } from "./product.controller";

export class ProductRoutes {


  static get routes(): Router {

    const router = Router();


    const productService = new ProductService();


    const controller = new ProductController(productService);

    // Definir las rutas
    router.get('/', controller.getAllProducts);
    router.get('/price-range', controller.getAllProductsWithPriceRange);
    router.get('/:id', controller.getById);
    router.post('/', controller.createProduct );
    router.put('/:id', controller.updateCustomer );


    // router.get('/validate-email/:token', controller.validateEmail );




    return router;
  }


}
