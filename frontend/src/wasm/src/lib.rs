use wasm_bindgen::prelude::*;
use std::f64::consts::PI;

#[wasm_bindgen]
pub struct OptionParams {
    spot_price: f64,
    strike_price: f64,
    time_to_expiry: f64,
    volatility: f64,
    risk_free_rate: f64,
    option_type: String,
}

#[wasm_bindgen]
impl OptionParams {
    #[wasm_bindgen(constructor)]
    pub fn new(
        spot_price: f64,
        strike_price: f64,
        time_to_expiry: f64,
        volatility: f64,
        risk_free_rate: f64,
        option_type: String,
    ) -> OptionParams {
        OptionParams {
            spot_price,
            strike_price,
            time_to_expiry,
            volatility,
            risk_free_rate,
            option_type,
        }
    }
}

#[wasm_bindgen]
pub fn calculate_option_price(params: OptionParams) -> f64 {
    let d1 = calculate_d1(
        params.spot_price,
        params.strike_price,
        params.time_to_expiry,
        params.volatility,
        params.risk_free_rate,
    );
    let d2 = calculate_d2(d1, params.volatility, params.time_to_expiry);

    let price = if params.option_type == "call" {
        calculate_call_price(
            params.spot_price,
            params.strike_price,
            params.time_to_expiry,
            params.risk_free_rate,
            d1,
            d2,
        )
    } else {
        calculate_put_price(
            params.spot_price,
            params.strike_price,
            params.time_to_expiry,
            params.risk_free_rate,
            d1,
            d2,
        )
    };

    price
}

fn calculate_d1(
    spot_price: f64,
    strike_price: f64,
    time_to_expiry: f64,
    volatility: f64,
    risk_free_rate: f64,
) -> f64 {
    (f64::ln(spot_price / strike_price)
        + (risk_free_rate + 0.5 * volatility * volatility) * time_to_expiry)
        / (volatility * f64::sqrt(time_to_expiry))
}

fn calculate_d2(d1: f64, volatility: f64, time_to_expiry: f64) -> f64 {
    d1 - volatility * f64::sqrt(time_to_expiry)
}

fn calculate_call_price(
    spot_price: f64,
    strike_price: f64,
    time_to_expiry: f64,
    risk_free_rate: f64,
    d1: f64,
    d2: f64,
) -> f64 {
    spot_price * normal_cdf(d1)
        - strike_price * f64::exp(-risk_free_rate * time_to_expiry) * normal_cdf(d2)
}

fn calculate_put_price(
    spot_price: f64,
    strike_price: f64,
    time_to_expiry: f64,
    risk_free_rate: f64,
    d1: f64,
    d2: f64,
) -> f64 {
    strike_price * f64::exp(-risk_free_rate * time_to_expiry) * normal_cdf(-d2)
        - spot_price * normal_cdf(-d1)
}

fn normal_cdf(x: f64) -> f64 {
    0.5 * (1.0 + erf(x / f64::sqrt(2.0)))
}

fn erf(x: f64) -> f64 {
    // Approximation of the error function
    let a1 = 0.254829592;
    let a2 = -0.284496736;
    let a3 = 1.421413741;
    let a4 = -1.453152027;
    let a5 = 1.061405429;
    let p = 0.3275911;

    let sign = if x < 0.0 { -1.0 } else { 1.0 };
    let x = f64::abs(x);

    let t = 1.0 / (1.0 + p * x);
    let y = 1.0
        - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1)
            * t
            * f64::exp(-x * x);

    sign * y
}

#[wasm_bindgen]
pub fn calculate_implied_volatility(
    market_price: f64,
    spot_price: f64,
    strike_price: f64,
    time_to_expiry: f64,
    risk_free_rate: f64,
    option_type: String,
) -> f64 {
    // Newton-Raphson method to find implied volatility
    let mut volatility = 0.5; // Initial guess
    let tolerance = 1e-5;
    let max_iterations = 100;
    let mut iteration = 0;

    while iteration < max_iterations {
        let params = OptionParams::new(
            spot_price,
            strike_price,
            time_to_expiry,
            volatility,
            risk_free_rate,
            option_type.clone(),
        );
        let price = calculate_option_price(params);
        let diff = price - market_price;

        if f64::abs(diff) < tolerance {
            return volatility;
        }

        // Calculate vega (derivative with respect to volatility)
        let d1 = calculate_d1(
            spot_price,
            strike_price,
            time_to_expiry,
            volatility,
            risk_free_rate,
        );
        let vega = spot_price * f64::sqrt(time_to_expiry) * normal_pdf(d1);

        if vega == 0.0 {
            break;
        }

        volatility = volatility - diff / vega;
        iteration += 1;
    }

    volatility
}

fn normal_pdf(x: f64) -> f64 {
    f64::exp(-0.5 * x * x) / f64::sqrt(2.0 * PI)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
