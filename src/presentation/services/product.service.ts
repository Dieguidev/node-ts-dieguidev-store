import { prisma } from "../../data/prisma";
import { CreateProductDto, CustomError } from "../../domain";
import { UpdateProductDto } from "../../domain/dtos/products/update-product.dto";



export class ProductService {


  async findOne(id: number) {
    const product = await prisma.product.findFirst({
      where: { id },
      // select: {
      //   email: true,
      // }
    })
    if (!product) throw CustomError.badRequest('Product not found');

    return product;
  }


  async findAll() {
    const products = await prisma.product.findMany({
      include: {
         category: true,
       }
    })
    return products;
  }


  async createProduct(createProductDto: CreateProductDto) {
    const { name, image, categoryId, description, price } = createProductDto;

    try {
      const existProduct = await prisma.product.findFirst({ where: { name } })
      if (existProduct) {
        throw CustomError.badRequest('Product already exist')
      }
      const existCategory = await prisma.category.findFirst({ where: { id: +categoryId } })
      if (!existCategory) {
        throw CustomError.badRequest('Category not found')
      }

      const product = await prisma.product.create({ data: {
        name,
        image,
        // category: {
        //   connect: {
        //     id: +categoryId
        //   }
        // },
        category_id: +categoryId,
        description,
        price: Number(price),
      } })
      return product;

    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    await this.findOne(+updateProductDto.id);

    if(+updateProductDto.categoryId){
      const category = await prisma.category.findFirst({
        where:{id: +updateProductDto.categoryId}
        });
      if(!category) throw CustomError.badRequest('Category not found');
    }

    const { id ,categoryId,...rest } = updateProductDto;
    const product = await prisma.product.update({
      where: { id: +id },
      data: {
        ...rest,
        price: (rest.price)? (+rest.price): undefined,
        // category: {
        //   connect: {
        //     id: +rest.categoryId
        //   }
        // },
        category_id: (categoryId)? (+categoryId): undefined
      },
    })
    return product;
  }
}
