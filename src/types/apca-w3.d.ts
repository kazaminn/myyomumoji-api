declare module "apca-w3" {
  /**
   * High-level APCA contrast calculation.
   * @param textColor - hex string (e.g. "#123456") or 0xRRGGBB number
   * @param bgColor - hex string or 0xRRGGBB number
   * @param places - decimal places (-1 returns float, default: -1)
   * @param round - whether to round (default: true)
   * @returns Lc contrast value (signed float when places < 0)
   */
  export function calcAPCA(
    textColor: string | number,
    bgColor: string | number,
    places?: number,
    round?: boolean,
  ): number;

  /**
   * Font lookup table for a given APCA contrast.
   * @param contrast - APCA Lc value
   * @param places - decimal places (default: 2)
   * @returns Array of 10 elements:
   *   [0] = contrast value,
   *   [1..9] = minimum font size (px) for weights 100..900.
   *   999 = too low contrast, 777 = non-text only.
   */
  export function fontLookupAPCA(contrast: number, places?: number): number[];

  export function sRGBtoY(rgb: [number, number, number]): number;

  export function APCAcontrast(
    txtY: number,
    bgY: number,
    places?: number,
  ): number;
}
