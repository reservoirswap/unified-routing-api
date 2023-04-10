import { BigNumber } from 'ethers';

export const DEFAULT_AUCTION_PERIOD_SECS = 60;
export const DEFAULT_EXCLUSIVE_PERIOD_SECS = 16;
export const DEFAULT_SLIPPAGE_TOLERANCE = '0.5'; // 0.5%
export const HUNDRED_PERCENT = BigNumber.from(100_00); // 100.00%
export const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000';
export const WETH_WRAP_GAS = 27938; // 27,938 warm deposit, 45,038 cold deposit
