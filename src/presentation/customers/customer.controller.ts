import { Request, Response } from "express";
import { CustomError, PaginationDto, UpdateCustomerDto } from "../../domain";
import { CustomerService } from "../services/customer.service";
import { CreateCustomerDto } from "../../domain/dtos/customer/create-customer";




export class CustomerController {

  constructor(private customerService: CustomerService) {
  }


  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' })
  }


  getCustomerById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.customerService.findOne(Number(id))
      .then(customer => res.status(200).json({ customer }))
      .catch(error => this.handleError(error, res))
  }


  getAllCustomer = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.customerService.getAllCustomers(paginationDto!)
      .then(customers => res.status(200).json(customers))
      .catch(error => this.handleError(error, res));

  }


  createCustomer = (req: Request, res: Response) => {
    const [error, creatCustomerDto] = CreateCustomerDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.customerService.createCustomer(creatCustomerDto!)
      .then((customer) => res.status(201).json(customer))
      .catch((error) => this.handleError(error, res));
  }


  updateCustomer = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateCustomerDto] = UpdateCustomerDto.create({ id, ...req.body });

    if (error) return res.status(400).json({ error });



    this.customerService.updateCustomer(updateCustomerDto!)
      .then(customer => res.status(200).json({ customer }))
      .catch(error => this.handleError(error, res))
  }


  deleteCustomer = (req: Request, res: Response) => {
    const { id } = req.params;

    this.customerService.deleteCustomer(Number(id))
      .then((customer) => res.send({ customer }))
      .catch(error => this.handleError(error, res))
  }
}
