export interface IImageContainer {
  items: ImageItem[];
}
export interface IPostContainer {
  posts: PostImage[];
}
export class ImageItem {
  id: string;
  url: string;
  base64: string;
}

export class PostImage {
  type: string;
  url: string;
}
