import { prisma } from "../../data/prisma";
import { CustomError, PaginationDto, UpdateCustomerDto } from "../../domain";
import { CreateCustomerDto } from "../../domain/dtos/customer/create-customer";
import { AuthService } from "./auth.service";



export class CustomerService {

  constructor(
    private readonly authService: AuthService
  ) { }

  async findOne(id: number) {
    const user = await prisma.customer.findFirst({
      where: { id },
      // select: {
      //   email: true,
      // }
    })
    if (!user) throw CustomError.badRequest('User not found');

    return user;
  }


  async getAllCustomers(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;


    try {

      const [total, customers] = await Promise.all([

        prisma.customer.count(),
        prisma.customer.findMany({
          skip: skip,
          take: limit,
          orderBy: { id: 'asc' },
          select: {
            id: true,
            name: true,
            lastName: true,
            phone: true,
            user: {
              select: {
                email: true,
                id: true
              }
            }
          }
        })
      ])

      return {
        page,
        limit,
        total: total,
        next: (total - (page * limit)) > 0 ? `/api/customer?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/customer?page=${page - 1}&limit=${limit}` : null,
        customers: customers
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }


  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const { email, password, role, ...rest } = createCustomerDto;

    // const existingCustomer = await prisma.customer.findFirst({ where: { user: { id: +user_id } } });
    // if (existingCustomer) {
    //   throw CustomError.badRequest('A customer with this user ID already exists');
    // }

    // const existUser = await prisma.user.findFirst({ where: { id: +user_id } })
    // if (!existUser) {
    //   throw CustomError.badRequest('User not found')
    // }
    try {
      const newUser = await this.authService.registerUser({ email, password, role });
      if (!newUser) throw CustomError.badRequest('User not created');

      const customer = await prisma.customer.create({
        data: {
          ...rest,
          user: {
            connect: {
              id: +newUser.user.id
            }
          }
        },
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          user: {
            select: {
              email: true,
              id: true
            }
          }
        }
      })
      if (!customer){
        await prisma.user.delete({ where: { id: +newUser.user.id } });
        throw CustomError.badRequest('Customer not created');
      }

      return customer;
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }

  }


  async updateCustomer(updateCustomerDto: UpdateCustomerDto) {
    const { id, ...rest } = updateCustomerDto

    const customerExists = await this.findOne(+id);

    const customer = await prisma.customer.update({
      where: { id: +id },
      data: rest,
      // select: {
      //   email: true,
      //   name: true,
      //   available: true,
      // }
    })

    return customer;
  }


  async deleteCustomer(id: number) {
    const customerExists = await this.findOne(+id);

    const customer = await prisma.customer.delete({
      where: { id: +id },
    })

    return customer;
  }
}
