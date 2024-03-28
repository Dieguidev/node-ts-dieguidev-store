import { Router } from 'express';
import { AuthRoutes } from './auth/auth.routes';
import { UserRoutes } from './users/user.routes';
import { CustomerRoutes } from './customers/customer.routes';
import { CategoryRoutes } from './categories/category.routes';
import { ProductRoutes } from './products/product.routes';
// import { CategoryRoutes } from './category/category.routes';
// import { ProductRoutes } from './products/products.routes';





export class AppRoutes {


  static get routes(): Router {



    const router = Router();



    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/customer', CustomerRoutes.routes)
    router.use('/api/category', CategoryRoutes.routes);
    router.use('/api/products', ProductRoutes.routes);



    return router;
  }


}

