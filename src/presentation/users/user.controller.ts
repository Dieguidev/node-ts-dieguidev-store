import { Request, Response } from "express";
import { CustomError, PaginationDto, UpdateUserDto } from "../../domain";
import { UserService } from "../services/user.service";



export class UserController {

  constructor(private userService: UserService) { }

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' })
  }


  getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService.findOne(Number(id))
      .then(user => res.status(200).json({ user }))
      .catch(error => this.handleError(error, res))
  }

  getAllUsers = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.userService.getAllUsers(paginationDto!)
      .then(categories => res.status(200).json(categories))
      .catch(error => this.handleError(error, res));

  }

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDto] = UpdateUserDto.create({ id, ...req.body });
    console.log(updateUserDto);

    if (error) return res.status(400).json({ error });



    this.userService.updateUser(updateUserDto!)
      .then(user => res.status(200).json({ user }))
      .catch(error => this.handleError(error, res))
  }


  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService.deleteUser(Number(id))
      .then((user) => res.send({ user }))
      .catch(error => this.handleError(error, res))
  }



}
