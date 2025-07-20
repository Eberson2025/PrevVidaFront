declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.mp3";
declare module "*.webp";
declare module "*.gif";

interface ImportMeta {
  env: {
    VITE_URL_API: any;
    BASE_URL: string;
  };
}
