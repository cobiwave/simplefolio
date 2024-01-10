import type PostHTML from "posthtml";
import type { MinifyOptions } from "terser";
import type { Options as CssNanoOptions } from "cssnano";
import type { Config as SvgoOptimizeOptions } from "svgo";

export interface HtmlnanoOptions {
  skipConfigLoading?: boolean;
  collapseAttributeWhitespace?: boolean;
  collapseBooleanAttributes?: {
    amphtml?: boolean;
  };
  collapseWhitespace?: "conservative" | "all" | "aggressive";
  custom?: (tree: PostHTML.Node, options?: any) => PostHTML.Node;
  deduplicateAttributeValues?: boolean;
  minifyUrls?: URL | string | false;
  mergeStyles?: boolean;
  mergeScripts?: boolean;
  minifyCss?: CssNanoOptions | boolean;
  minifyConditionalComments?: boolean;
  minifyJs?: MinifyOptions | boolean;
  minifyJson?: boolean;
  minifySvg?: SvgoOptimizeOptions | boolean;
  normalizeAttributeValues?: boolean;
  removeAttributeQuotes?: boolean;
  removeComments?: boolean | "safe" | "all" | RegExp | (() => boolean);
  removeEmptyAttributes?: boolean;
  removeRedundantAttributes?: boolean;
  removeOptionalTags?: boolean;
  removeUnusedCss?: boolean;
  sortAttributes?: boolean | "alphabetical" | "frequency";
  sortAttributesWithLists?: boolean | "alphabetical" | "frequency";
}

export interface HtmlnanoPreset extends Omit<HtmlnanoOptions, "skipConfigLoading"> {}

export interface Presets {
  safe: HtmlnanoPreset;
  ampSafe: HtmlnanoPreset;
  max: HtmlnanoPreset;
}

type Preset = Presets[keyof Presets];

export function loadConfig(
  options?: HtmlnanoOptions,
  preset?: Preset,
  configPath?: string
): [HtmlnanoOptions | {}, Preset];

declare function htmlnano<TMessage>(
  options?: HtmlnanoOptions,
  preset?: Preset
): (tree: PostHTML.Node) => Promise<PostHTML.Result<TMessage>>;

interface PostHtmlOptions {
  directives?: Array<{
    name: string | RegExp;
    start: string;
    end: string;
  }>;
  sourceLocations?: boolean;
  recognizeNoValueAttribute?: boolean;
  xmlMode?: boolean;
  decodeEntities?: boolean;
  lowerCaseTags?: boolean;
  lowerCaseAttributeNames?: boolean;
  recognizeCDATA?: boolean;
  recognizeSelfClosing?: boolean;
  Tokenizer?: any;
}

declare namespace htmlnano {
  export function process<TMessage>(
    html: string,
    options?: HtmlnanoOptions,
    preset?: Preset,
    postHtmlOptions?: PostHtmlOptions
  ): Promise<PostHTML.Result<TMessage>>;

  export function getRequiredOptionalDependencies(
    optionsRun?: HtmlnanoOptions,
    presetRun?: Preset
  ): string[];

  export function htmlMinimizerWebpackPluginMinify(
    input: { [file: string]: string },
    minimizerOptions?: HtmlnanoOptions
  ): any;

  export const presets: Presets;
}

export default htmlnano;
