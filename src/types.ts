// File: src/types/dom-to-image-more.d.ts
declare module "dom-to-image-more" {
  const domToImage: {
    toPng(
      node: HTMLElement,
      options?: {
        bgcolor?: string;
        width?: number;
        height?: number;
        style?: Partial<CSSStyleDeclaration>;
        filter?: (node: HTMLElement) => boolean;
        quality?: number;
        imagePlaceholder?: string;
        cacheBust?: boolean;
      }
    ): Promise<string>;
  };

  export default domToImage;
}
