let wasmModule = null;

export async function initWasm() {
  if (wasmModule) {
    return wasmModule;
  }

  try {
    const response = await fetch('/wasm/options_pricing_wasm_bg.wasm');
    const wasmBinary = await response.arrayBuffer();
    
    const imports = {
      wasm_bindgen: (await import('../wasm/pkg/options_pricing_wasm.js')).default,
    };

    const { instance } = await WebAssembly.instantiate(wasmBinary, imports);
    wasmModule = instance.exports;
    return wasmModule;
  } catch (error) {
    console.error('Error loading WebAssembly module:', error);
    throw error;
  }
}

export async function calculateOptionPrice(params) {
  if (!wasmModule) {
    await initWasm();
  }

  const { OptionParams, calculate_option_price } = wasmModule;
  const optionParams = new OptionParams(
    params.spotPrice,
    params.strikePrice,
    params.timeToExpiry,
    params.volatility,
    params.riskFreeRate,
    params.optionType
  );

  return calculate_option_price(optionParams);
}

export async function calculateImpliedVolatility(params) {
  if (!wasmModule) {
    await initWasm();
  }

  const { calculate_implied_volatility } = wasmModule;
  return calculate_implied_volatility(
    params.marketPrice,
    params.spotPrice,
    params.strikePrice,
    params.timeToExpiry,
    params.riskFreeRate,
    params.optionType
  );
} 