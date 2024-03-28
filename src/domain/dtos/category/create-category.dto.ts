



export class CreateCategoryDto {
  private constructor(
    public readonly name: string,
    public readonly image: string,
  ) { }


  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, image } = object;

    if (!name) return ['Name is required'];
    if (!image) return ['Lastname is required'];

    return [undefined, new CreateCategoryDto(name, image)];
  }
}
