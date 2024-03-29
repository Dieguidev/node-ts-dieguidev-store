import { bcryptAdapter } from "../../config/bcrypt.adapter";

import { prisma } from "../../data/prisma";
import { CustomError, PaginationDto } from "../../domain";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";




export class UserService {

  async findOne(id: number) {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        email: true,
      }
    })
    if (!user) throw CustomError.badRequest('User not found');

    return user;
  }

  async getAllUsers(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {

      const [total, users] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
          skip: skip,
          take: limit,
          orderBy: { id: 'asc' },
          select: {
            id: true,
            email: true,
            role: true,
            customer: {
              select: {
                id: true,
                name: true,
                lastName: true,
                phone: true,

              }
            }
          }
        })
      ])

      return {
        page,
        limit,
        total: total,
        next: (total - (page * limit)) > 0 ? `/api/user?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/user?page=${page - 1}&limit=${limit}` : null,
        users: users
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }




  async updateUser(updateUserDto: UpdateUserDto) {
    const { id, email, password } = updateUserDto

    const userExists = await this.findOne(+id);



    if (email && password) {
      const userEmailExists = await prisma.user.findFirst({ where: { email } });
      if (userEmailExists) throw CustomError.badRequest('Email already exists');

      const hashedPassword = bcryptAdapter.hash(password)

      const userUpdated = await prisma.user.update({
        where: {
          id: Number(id)
        },
        data: { email, password: hashedPassword }
      });

      return userUpdated;

    } else if (email) {
      const userEmailExists = await prisma.user.findFirst({ where: { email } });
      if (userEmailExists) throw CustomError.badRequest('Email already exists');
      const userUpdated = await prisma.user.update({
        where: {
          id: Number(id)
        },
        data: { email }
      });
      return userUpdated;
    } else if (password) {
      const hashedPassword = bcryptAdapter.hash(password)
      const userUpdated = await prisma.user.update({
        where: {
          id: Number(id)
        },
        data: { password: hashedPassword }
      });
      return userUpdated;
    } else {
      return userExists;
    }


  }


  async deleteUser(id: number) {
    await this.findOne(id)

    const user = await prisma.user.delete({
      where: { id },
      select: {
        email: true,
      }
    });
    console.log(user);

    return user;

  }
}
