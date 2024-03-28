import { prisma } from "../../data/prisma";
import { CustomError } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";




export class CategoryService {


  async findOne(id: number) {
    const category = await prisma.category.findFirst({
      where: { id },
      // select: {
      //   email: true,
      // }
    })
    if (!category) throw CustomError.badRequest('User not found');

    return category;
  }


  async findAll() {
    const categories = await prisma.category.findMany({
      include: {
        products: true
      }
      // select: {
      //   email: true,
      // }

    })
    return categories;
  }


  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, image } = createCategoryDto;

    try {
      const existCategory = await prisma.category.findFirst({ where: { name } })
      if (existCategory) {
        throw CustomError.badRequest('User already exist')
      }

      const category = await prisma.category.create({ data: { name, image } })
      return category;

    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }

  }
}
