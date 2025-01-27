const {ethers} = require('hardhat');

async function main() {
    accounts = await ethers.getSigners();
    factoryAddress = "0x5bfC27746aD3F24FaF7489D9F5F258B405041168";

    WETHFactory = await ethers.getContractFactory('WETH9');
    WETH = await WETHFactory.deploy();
    await WETH.deployed();
    console.log('WETH deployed to:', WETH.address);
    try {
        await hre.run("verify:verify", {
        address: WETH.address,
        constructorArguments: [
        ],
      });
    } catch (error) {
        console.log("Error verifying WETH contract: ", error);
    }

    NonfungibleTokenPositionDescriptorFactory = await ethers.getContractFactory('NonfungibleTokenPositionDescriptor');
    NonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptorFactory.deploy(WETH.address, "0x0000000000000000000000000000000000000000000000000000000000000000");
    await NonfungibleTokenPositionDescriptor.deployed();
    console.log('NonfungibleTokenPositionDescriptor deployed to:', NonfungibleTokenPositionDescriptor.address);
    try {
        await hre.run("verify:verify", {
        address: NonfungibleTokenPositionDescriptor.address,
        constructorArguments: [
            WETH.address,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        ],
      });
    } catch (error) {
        console.log("Error verifying NonfungibleTokenPositionDescriptor contract: ", error);
    }

    NonfungiblePositionManagerFactory = await ethers.getContractFactory('NonfungiblePositionManager');
    NonfungiblePositionManager = await NonfungiblePositionManagerFactory.deploy(factoryAddress, WETH.address, NonfungibleTokenPositionDescriptor.address);
    await NonfungiblePositionManager.deployed();
    console.log('NonfungiblePositionManager deployed to:', NonfungiblePositionManager.address);
    try {
        await hre.run("verify:verify", {
        address: NonfungiblePositionManager.address,
        constructorArguments: [
            factoryAddress,
            WETH.address,
            NonfungibleTokenPositionDescriptor.address
        ],
        });
    } catch (error) {
        console.log("Error verifying NonfungiblePositionManager contract: ", error);
    }

    SwapRouterFactory = await ethers.getContractFactory('SwapRouter');
    SwapRouter = await SwapRouterFactory.deploy(factoryAddress, WETH.address);
    await SwapRouter.deployed();
    console.log('SwapRouter deployed to:', SwapRouter.address);
    try {
        await hre.run("verify:verify", {
        address: SwapRouter.address,
        constructorArguments: [
            factoryAddress,
            WETH.address
        ],
        });
    } catch (error) {
        console.log("Error verifying SwapRouter contract: ", error);
    }
    

    ERC20Factory = await ethers.getContractFactory('TestERC0');
    token1 = await ERC20Factory.deploy("Token1", "T1");
    await token1.deployed();
    console.log('Token1 deployed to:', token1.address);
    try {
        await hre.run("verify:verify", {
        address: token1.address,
        constructorArguments: [
            "Token1",
            "T1"
        ],
        });
    } catch (error) {
        console.log("Error verifying Token1 contract: ", error);
    }

    token0 = await ERC20Factory.deploy("Token0", "T0");
    await token0.deployed();
    console.log('Token0 deployed to:', token0.address);
    try {
        await hre.run("verify:verify", {
        address: token0.address,
        constructorArguments: [
            "Token0",
            "T0"
        ],
        });
    } catch (error) {
        console.log("Error verifying Token0 contract: ", error);
    }

    
    tx = await token0.approve(NonfungiblePositionManager.address, ethers.constants.MaxUint256);
    await tx.wait();
    tx = await token1.approve(NonfungiblePositionManager.address, ethers.constants.MaxUint256);
    await tx.wait();

    tx = await NonfungiblePositionManager.createAndInitializePoolIfNecessary(token0.address, token1.address, 3000, "79228162514264337593543950336");
    await tx.wait();
    console.log("Pool created and initialized at Tx Hash: ", tx.hash);

    console.log("Minting NFT");
    tx = await NonfungiblePositionManager.mint({
        token0: token0.address, 
        token1: token1.address, 
        fee: 3000, 
        tickLower: -887220, 
        tickUpper: 887220, 
        amount0Desired: ethers.utils.parseEther("1000"), 
        amount1Desired: ethers.utils.parseEther("1000"), 
        amount0Min: 0, 
        amount1Min: 0, 
        recipient: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
        deadline: ethers.constants.MaxUint256
    });
    await tx.wait();
    console.log("NFT minted at Tx Hash: ", tx.hash);

    // Swap tokens
    tx = await token0.approve(SwapRouter.address, ethers.constants.MaxUint256);
    await tx.wait();
    tx = await token1.approve(SwapRouter.address, ethers.constants.MaxUint256);
    await tx.wait();

    tx = await SwapRouter.exactInputSingle({
        tokenIn: token0.address,
        tokenOut: token1.address,
        fee: 3000,
        recipient: accounts[0].address,
        deadline: ethers.constants.MaxUint256,
        amountIn: ethers.utils.parseEther("100"),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    });
    console.log("Swap executed at Tx Hash: ", tx.hash);
    
    v3Factory = await ethers.getContractAt('IUniswapV3Factory', factoryAddress);
    v3Pool = await ethers.getContractAt("IUniswapV3CustomPool", await v3Factory.getPool(token0.address, token1.address, 3000));
    console.log("Pool address: ", v3Pool.address);
    
    console.log("Treue Fee: ", (await v3Pool.getFee(true)).toString());
    console.log("False Fee: ", (await v3Pool.getFee(false)).toString());
    console.log("BaseFee: ", (await v3Pool.baseFee()).toString());
    tx = await v3Pool.enableDynamicFee(true);
    await tx.wait();
    console.log("Dynamic fee enabled at Tx Hash: ", tx.hash);

    tx = await SwapRouter.exactInputSingle({
        tokenIn: token1.address,
        tokenOut: token0.address,
        fee: 3000,
        recipient: accounts[0].address,
        deadline: ethers.constants.MaxUint256,
        amountIn: ethers.utils.parseEther("1000"),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    });
    console.log("Swap executed at Tx Hash: ", tx.hash);
    console.log(" True Fee: ", (await v3Pool.getFee(true)).toString());
    console.log("Fasle Fee: ", (await v3Pool.getFee(false)).toString());

    // remove liquidity from pool
    // tx = await NonfungiblePositionManager.burn(1);
    // await tx.wait();
    // console.log("Liquidity removed at Tx Hash: ", tx.hash);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });