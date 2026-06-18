declare module "glob-all" {
  type GlobOptions = {
    nodir?: boolean;
    cwd?: string;
    absolute?: boolean;
  };

  const glob: {
    sync(patterns: string[], options?: GlobOptions): string[];
  };

  export default glob;
}
