



export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly image: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoryId: number,
  ){}


  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, image, description, price, categoryId } = object;

    if (!name) return ['Name is required'];
    if (!image) return ['image is required'];
    if (!description) return ['Description is required'];
    if (!price) return ['Price is required'];
    if (!categoryId) return ['Category is required'];

    return [undefined, new CreateProductDto(name, image, description, price, categoryId )];
  }
}
