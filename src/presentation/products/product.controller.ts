import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { UpdateProductDto } from "../../domain/dtos/products/update-product.dto";



export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}


  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' })
  }


  createProduct = (req: Request, res: Response) => {
    const [error, creatProductDto] = CreateProductDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.productService.createProduct(creatProductDto!)
      .then((product) => res.status(201).json(product))
      .catch((error) => this.handleError(error, res));
  }

  updateCustomer = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateProductDto] = UpdateProductDto.create({ id, ...req.body });

    if (error) return res.status(400).json({ error });

    this.productService.updateProduct(updateProductDto!)
      .then(product => res.status(200).json({ product }))
      .catch(error => this.handleError(error, res))
  }


  getById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.productService.findOne(Number(id))
      .then(product => res.status(200).json({ product }))
      .catch(error => this.handleError(error, res))
  }

  getAllProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10, price } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });
    if (price && isNaN(Number(price))) return res.status(400).json({ error: 'Price not number' });

    this.productService.findAll(paginationDto!, +price!)
      .then(products => res.status(200).json( products ))
      .catch(error => this.handleError(error, res))
  }


  getAllProductsWithPriceRange = (req: Request, res: Response) => {
    const { page = 1, limit = 10, minPrice, maxPrice } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });
    if (!minPrice && isNaN(Number(minPrice))) return res.status(400).json({ error: 'Minimum price required or is it not a number' });
    if (!maxPrice && isNaN(Number(maxPrice))) return res.status(400).json({ error: 'Maximun price required or is it not a number' });

    this.productService.findAllWithPriceRange(paginationDto!, +minPrice!, +maxPrice!)
      .then(products => res.status(200).json( products ))
      .catch(error => this.handleError(error, res))
  }
}
