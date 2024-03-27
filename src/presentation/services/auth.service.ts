import { envs } from "../../config";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../data/prisma";

import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { EmailService } from "./email.service";




export class AuthService {

  constructor(
    //DI - Servicio Email
    private readonly emailservice: EmailService,
  ) { }

  async registerUser(registerUserDto: RegisterUserDto) {

    const { email, password } = registerUserDto
    // const existUser = await User.findOne({ where: { email }, raw: true });
    const existUser = await prisma.user.findFirst({ where: { email } })
    if (existUser) {
      throw CustomError.badRequest('User already exist')
    }

    try {
      //encriptar contraseña
      const hashedPassword = bcryptAdapter.hash(password)

      //enviar correo de verificacion
      await this.sendEmailValidationLink(email)

      const newUserInput = {
        ...registerUserDto,
        password: hashedPassword
      }

      const newUser = await prisma.user.create({ data: newUserInput })


      const token = await this.generateTokenService(newUser.id.toString())

      return {
        user: newUser,
        token
      }

    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }

  }

  async loginUser(loginUserDto: LoginUserDto) {
    //find one para verificar si existe el usuario
    const { email, password } = loginUserDto
    const existUser = await prisma.user.findFirst({ where: { email } })
    if (!existUser) {
      throw CustomError.badRequest('Invalid credentials')
    }



    //ismatch ..bcrypt
    const isMatchPassword = bcryptAdapter.compare(password, existUser!.password)
    if (!isMatchPassword) {
      throw CustomError.badRequest('Invalid credentials')
    }

    // const { password, ...userEntity } = UserEntity.fromJson(user)

    const token = await this.generateTokenService(existUser!.id.toString())



    return {
      user: existUser,
      token: token
    }
  }


  //metodo para genrar token--puede ser un caso de uso
  private async generateTokenService(id: string) {
    const token = await JwtAdapter.generateToken({ id })
    if (!token) {
      throw CustomError.internalServer('Error generating token')
    }
    return token
  }

  //este metodo puede ser un caso de uso -- metodo para enviar correo
  private async sendEmailValidationLink(email: string) {
    const token = await JwtAdapter.generateToken({ email })
    if (!token) {
      throw CustomError.internalServer('Error generating token')
    }

    const link = `${envs.WEBSERVICE_URL}/api/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Please click the following link to validate your email:</p>
      <a href="${link}">validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      html,
    }

    const isSent = await this.emailservice.sendEmail(options);
    if (!isSent) {
      throw CustomError.internalServer('Error sending email')
    }

    return true;
  }


  // // metodo para validar token
  // public async validateEmail(token: string) {
  //   const payload = await JwtAdapter.validateToken(token);
  //   if (!payload) {
  //     throw CustomError.unauthorized('Invalid token');
  //   }

  //   const { email } = payload as { email: string }
  //   if (!email) {
  //     throw CustomError.internalServer('Email not in token');
  //   };

  //   const user = await prisma.user.findFirst({ where: { email } })
  //   if (!user) {
  //     throw CustomError.badRequest('User not found');
  //   };

  //   user.emailValidated = true;
  //   await user.save();

  //   return true;
  // }
}
