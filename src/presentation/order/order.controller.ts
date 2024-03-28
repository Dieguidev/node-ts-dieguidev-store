import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { OrderService } from "../services/oreder.service";
import { CreateOrderDto } from "../../domain/dtos/order/create-order.dto";
import { AddProductInOrderDto } from '../../domain/dtos/order/add-product-in-order.dto';



export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}


  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' })
  }


  createOrder = (req: Request, res: Response) => {
    const [error, createOrderDto] = CreateOrderDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.orderService.createOrder(createOrderDto!)
      .then((order) => res.status(201).json(order))
      .catch((error) => this.handleError(error, res));
  }

  // updateCustomer = (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const [error, updateProductDto] = UpdateProductDto.create({ id, ...req.body });

  //   if (error) return res.status(400).json({ error });

  //   this.productService.updateProduct(updateProductDto!)
  //     .then(product => res.status(200).json({ product }))
  //     .catch(error => this.handleError(error, res))
  // }


  getById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.orderService.findById(Number(id))
      .then(order => res.status(200).json({ order }))
      .catch(error => this.handleError(error, res))
  }

  getAllOrders = (req: Request, res: Response) => {
    this.orderService.findAll()
      .then(orders => res.status(200).json({ orders }))
      .catch(error => this.handleError(error, res))
  }


  addProductToOrder = (req: Request, res: Response) => {
    const [error, addProductInOrderDto] = AddProductInOrderDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.orderService.addProduct(addProductInOrderDto!)
      .then(order => res.status(200).json( order))
      .catch(error => this.handleError(error, res))
  }
}
