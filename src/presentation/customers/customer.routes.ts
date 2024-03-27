import { Router } from "express";
import { CustomerService } from "../services/customer.service";
import { CustomerController } from "./customer.controller";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";




export class CustomerRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );
    const authService = new AuthService(emailService)
    const customerService = new CustomerService(authService);

    const controller = new CustomerController(customerService);

    // Definir las rutas
    router.get('/', controller.getAllCustomer);
    router.put('/:id', controller.updateCustomer );
    router.delete('/:id', controller.deleteCustomer);
    router.get('/:id', controller.getCustomerById);
    router.post('/', controller.createCustomer);

    // router.get('/' ,controller.getAllCategories );




    return router;
  }


}
