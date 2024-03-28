import { prisma } from "../../data/prisma";
import { CustomError } from "../../domain";
import { AddProductInOrderDto } from "../../domain/dtos/order/add-product-in-order.dto";
import { CreateOrderDto } from "../../domain/dtos/order/create-order.dto";




export class OrderService {

  async findById(id: number) {
    const order = await prisma.order.findFirst({
      where: { id },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        products: {
          select: {
            amount: true,
            product: true
          }
        },
      }
    })

    const total = order!.products.reduce((total, item) => {
      return total + (item.product.price * item.amount)
    }, 0);

    return {
      total,
      order
    };
  }

  async findAll() {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          include: {
            user: true
          }
        }

      }
    })
    return { orders };
  }


  async createOrder(createOrderDto: CreateOrderDto) {
    const { customerId } = createOrderDto;

    try {
      const existCustomer = await prisma.customer.findFirst({ where: { id: +customerId } })
      if (!existCustomer) {
        throw CustomError.badRequest('Customer not Found')
      }


      const order = await prisma.order.create({
        data: {
          customer_id: +customerId,
        }
      })
      return order;

    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }


  async addProduct(addProductInOrderDto: AddProductInOrderDto) {
    const { orderId, productId, amount } = addProductInOrderDto;

    const product = await prisma.product.findFirst({ where: { id: productId } })
    if (!product) throw CustomError.badRequest('Product not found');

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        products: true
      }
    })
    if (!order) throw CustomError.badRequest('Order not found');

    const existProductInOrder = order.products.find(product => product.product_id === productId);

    let orderProduct;
    if (existProductInOrder) {
      orderProduct = await prisma.orderproduct.update({
        where: { id: existProductInOrder.id },
        data: { amount: amount + existProductInOrder.amount }
      })
    } else {
      orderProduct = await prisma.orderproduct.create({
        data: {
          order_id: orderId,
          product_id: productId,
          amount
        }
      })
    }

    return orderProduct;
  }
}
