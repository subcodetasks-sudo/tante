declare module "watermarkjs" {
  type DrawFn = (
    target: HTMLCanvasElement,
    watermark: HTMLCanvasElement,
  ) => HTMLCanvasElement

  type WatermarkOptions = {
    init?: (img: HTMLImageElement) => void
    type?: "image/png" | "image/jpeg"
    encoderOptions?: number
  }

  type WatermarkChain = {
    image: (draw: DrawFn) => WatermarkChain
    dataUrl: (draw: DrawFn) => WatermarkChain
    blob: (draw: DrawFn) => WatermarkChain
    load: (
      resources: Array<string | File | Blob | HTMLImageElement>,
      init?: (img: HTMLImageElement) => void,
    ) => WatermarkChain
    render: () => WatermarkChain
    then: <TResult1 = HTMLImageElement, TResult2 = never>(
      onfulfilled?:
        | ((value: HTMLImageElement | string | Blob) => TResult1 | PromiseLike<TResult1>)
        | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) => Promise<TResult1 | TResult2>
  }

  type ImagePositionFns = {
    atPos: (
      xFn: (target: HTMLCanvasElement, mark: HTMLCanvasElement) => number,
      yFn: (target: HTMLCanvasElement, mark: HTMLCanvasElement) => number,
      alpha?: number,
    ) => DrawFn
    lowerRight: (alpha?: number) => DrawFn
    lowerLeft: (alpha?: number) => DrawFn
    upperRight: (alpha?: number) => DrawFn
    upperLeft: (alpha?: number) => DrawFn
    center: (alpha?: number) => DrawFn
  }

  interface WatermarkFactory {
    (
      resources: Array<string | File | Blob | HTMLImageElement>,
      options?: WatermarkOptions,
    ): WatermarkChain
    image: ImagePositionFns
    destroy: () => void
  }

  const watermark: WatermarkFactory
  export default watermark
}
