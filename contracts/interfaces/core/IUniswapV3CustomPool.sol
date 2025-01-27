// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

interface IUniswapV3CustomPool {
    function getFee(bool zeroForOne) external view returns (uint24);
    function enableDynamicFee(bool enable) external;
    function baseFee() external view returns (uint24);
}