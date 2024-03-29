import { prisma } from "../../data/prisma";
import { CustomError, PaginationDto } from "../../domain";
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


  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, categories] = await Promise.all([
        prisma.category.count(),
        prisma.category.findMany({
          skip: skip,
          take: limit,
          include: {
            products: true
          }
        })
      ]);

      return {
        page,
        limit,
        total: total,
        next: (total - (page * limit)) > 0 ? `/api/category?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/category?page=${page - 1}&limit=${limit}` : null,
        categories
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
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
