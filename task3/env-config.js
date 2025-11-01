const WAIT_CONFIRMATIONS = 5
const INITIAL_ETH_ANSWER = 400000000000
const INITIAL_LINK_ANSWER = 2000000000
const INITIAL_USDC_ANSWER = 99984973
const INITIAL_ERC20_ANSWER = 1842563497
const DECIMAL = 8
const developChains = ["hardhat", "local"]
const NFT_TOKEN_ID = 0
const AUCTION_FACTORY = "0xb172b03b58779455E4AE072A440dCfDe5Ac1B6dF"
const NFT_ADDRESS = "0x4dAC7c855aB5F6D6FF639B483b4C4F4653C87bEd"
const networkConfig = {
    11155111:{
        name: "sepolia",
        // 从https://docs.chain.link/ccip/getting-started/evm获取网络的各项信息
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        chainSelector: "16015286601757825753",
        companionChainSelector: "16281711391670634445", // 目标链的chainSelector
        // feeToken
        linkTokenAddr: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        /*  
            eth->usd erc20TokenAddress: 0x0000000000000000000000000000000000000000, priceFeedAddr: 0x694AA1769357215DE4FAC081bf1f309aDC325306, 393890988244
            LINK->usd erc20TokenAddress: 0x779877A7B0D9E8603169DdbD7836e478b4624789, priceFeedAddr: 0xc59E3633BAAC79493d908e63626716e204A45EdF, 1842563497
            usdc->usd erc20TokenAddress: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, priceFeedAddr: 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, 99984973
        */
        priceFeeds: [
            { // eth
                erc20TokenAddress: "0x0000000000000000000000000000000000000000",
                priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
                decimals: 18
            },
            { // link
                erc20TokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
                priceFeedAddress: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
                decimals: 18
            },
            { // usdc
                erc20TokenAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
                priceFeedAddress: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
                decimals: 6
            },
        ]
        
    },
}

module.exports = {
    developChains, networkConfig, WAIT_CONFIRMATIONS,INITIAL_ETH_ANSWER,INITIAL_LINK_ANSWER,INITIAL_USDC_ANSWER,DECIMAL,INITIAL_ERC20_ANSWER, NFT_TOKEN_ID, AUCTION_FACTORY,NFT_ADDRESS
}