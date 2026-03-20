export class Posts {
  id_post: number;
  descripcion: string;
  imagen: string;
  id_user: number;
  usuario: string;
  id_categoria: number;
  name_categoria: string;
  color_vibrant: string;
  color_muted: string;
  thirdColor: string;
  vibrant_class:string;
  muted_class:string;
  third_class:string;
  prenda1:string;
  prenda2:string;
  prenda3:string;
  prenda4:string;
  prenda5:string;
  prenda6:string;
  link1:string;
  link2:string;
  link3:string;
  link4:string;
  link5:string;
  link6:string;
  constructor(
    id_post: number,
    descripcion: string,
    imagen: string,
    id_user: number,
    usuario: string,
    id_categoria: number,
    name_categoria: string,
    color_vibrant: string,
    color_muted: string,
    thirdColor: string,
    vibrant_class:string,
    muted_class:string,
    third_class:string,
    prenda1:string,
    prenda2:string,
    prenda3:string,
    prenda4:string,
    prenda5:string,
    prenda6:string,
    link1:string,
    link2:string,
    link3:string,
    link4:string,
    link5:string,
    link6:string,
  ) {
    this.id_post = id_post;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.id_user = id_user;
    this.usuario = usuario;
    this.id_categoria = id_categoria;
    this.name_categoria = name_categoria;
    this.color_vibrant = color_vibrant;
    this.color_muted = color_muted;
    this.thirdColor = thirdColor;
    this.vibrant_class =vibrant_class;
    this.muted_class = muted_class;
    this.third_class = third_class;
    this.prenda1 = prenda1;
    this.prenda2 = prenda2;
    this.prenda3 = prenda3;
    this.prenda4 = prenda4;
    this.prenda5 = prenda5;
    this.prenda6 = prenda6;
    this.link1 = link1;
    this.link2 = link2;
    this.link3 = link3;
    this.link4 = link4;
    this.link5 = link5;
    this.link6 = link6;
  }
}
