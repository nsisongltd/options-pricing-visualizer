/* tslint:disable */
/* eslint-disable */
export function calculate_option_price(params: OptionParams): number;
export function calculate_implied_volatility(market_price: number, spot_price: number, strike_price: number, time_to_expiry: number, risk_free_rate: number, option_type: string): number;
export class OptionParams {
  free(): void;
  constructor(spot_price: number, strike_price: number, time_to_expiry: number, volatility: number, risk_free_rate: number, option_type: string);
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_optionparams_free: (a: number, b: number) => void;
  readonly optionparams_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly calculate_option_price: (a: number) => number;
  readonly calculate_implied_volatility: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
