import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain";
import { CategoryService } from "../services/category.service";





export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}


  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' })
  }


  getAllCategories = (req: Request, res: Response) => {
    this.categoryService.findAll()
      .then(categories => res.status(200).json({ categories }))
      .catch(error => this.handleError(error, res));
  }

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.categoryService.createCategory(createCategoryDto!)
      .then(category => res.status(201).json({ category }))
      .catch(error => this.handleError(error, res))
  }
}
