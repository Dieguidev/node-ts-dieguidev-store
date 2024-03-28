



export class UpdateProductDto {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly image: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoryId: number,
  ) { }

  static create(object: { [key: string]: any }): [string?, UpdateProductDto?] {
    const { id, name, image, description, price, categoryId } = object;

    if (!id || isNaN(Number(id))) return ['ID must be a valid number'];
    if(price && isNaN(Number(price))) return ['Price must be a valid number'];
    if(categoryId && isNaN(Number(categoryId))) return ['Price must be a valid number'];



    return [undefined, new UpdateProductDto(id, name, image, description, price, categoryId)];
  }
}
