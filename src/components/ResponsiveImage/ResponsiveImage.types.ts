export interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  mobileSize?: number;
  desktopSize?: number;
}
