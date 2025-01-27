# Uniswap V3 Fork with Dynamic Fees

## Overview

This repository is a customized fork of Uniswap V3, implementing a dynamic fee model inspired by Nezlobin's directional fee mechanism. The project has all necessary modifications for functionality and testing. This document provides an overview of the changes, deployment instructions, and additional resources for interacting with the contracts.

---

## Key Features

1. **Dynamic Fee Model**
   - The dynamic fee model adjusts based on market conditions such as volatility, liquidity, or price movements. See the [dynamic fee documentation](https://github.com/nobita851/customized_uniswapV3/blob/main/README.md) for details.

2. **Customized v3-core Submodule**
   - The v3-core submodule has been customized to include:
     - Dynamic fee logic.
   - All changes have been documented in the submodule's `README.md`.

3. **Simplified Deployment**
   - Certain libraries were removed from the `PositionDescriptor` in the v3-periphery module to streamline deployment.

4. **Init Code Hash**
    - Adjusted `POOL_INIT_CODE_HASH` for accurate computation of pool addresses.

5. **Deployment Script**
   - A script called `deployAndTest` is included to facilitate the deployment and testing process.

---

## Deployment Instructions

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the submodule:
   ```bash
   git submodule update --init --recursive
   ```

3. Ensure you have the necessary environment variables configured (e.g., private keys, RPC URLs).

### Steps

1. **Deploy the Customized v3-core:**
   - Navigate to the `customized_v3Pools` submodule directory and deploy the factory contract by running `deploy.js` script.
   - Save the deployed `factory` address for use in subsequent steps.

2. **Deploy v3-periphery:**
   - Update the `factory` address in the `deployAndTest` script.
   - Run the script to deploy and test the periphery contracts:
     ```bash
     node scripts/deployAndTest.js
     ```

3. **Verify Deployment:**
   - Interact with the deployed contracts on the testnet to ensure functionality.

---

---

## Deployed Contract Addresses

- **Factory Address:** [0x5bfC27746aD3F24FaF7489D9F5F258B405041168](https://sepolia.arbiscan.io/address/0x5bfC27746aD3F24FaF7489D9F5F258B405041168)
- **Router Address:** [0xC293693495E31a83d02940c8484C58790876975c](https://sepolia.arbiscan.io/address/0xc293693495e31a83d02940c8484c58790876975c)
- **NonFungiblePositionManager Address:** [0xb38C0925fe388737be5A91CfA31De5Bc4Cb4D191](https://sepolia.arbiscan.io/address/0xb38C0925fe388737be5A91CfA31De5Bc4Cb4D191)
- **Pool Examples:** [0x4F5b5d0eAde6eED20C8B741F1BC0d843B9b4BE54](https://sepolia.arbiscan.io/address/0x4F5b5d0eAde6eED20C8B741F1BC0d843B9b4BE54)  

---

## Additional Resources

- [Dynamic Fee Documentation](./customized_v3Pools/README.md)

---

## References

[Nezlobin's tweet](https://x.com/0x94305/status/1674857993740111872).
