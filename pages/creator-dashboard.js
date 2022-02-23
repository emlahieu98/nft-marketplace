import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { nftAddress, nftMarketAddress } from "../config"
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-2xl text-center">No assets created</h1>)
    return (
        <div className="container mx-auto">
            <div className="p-4">
                <h2 className="text-2xl py-2">Items Created</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="rounded overflow-hidden shadow-lg border border-slate-300 hover:border-pink-500">
                                <img className="w-full object-contain h-48 object-center" src={nft.image} />
                                <div className="px-6 py-4">
                                    <div className="font-bold text-xl mb-2 text-center">{nft.name}</div>
                                    <p className="text-gray-700 text-base">
                                        {nft.description}
                                    </p>
                                </div>
                                <div className="px-6 pt-4 pb-2 text-center">
                                    <p className="text-xl mb-4 font-bold text-black">{nft.price}
                                        <i className="fa-brands fa-ethereum ml-2"></i>
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="px-4">
                {
                    Boolean(sold.length) && (
                        <div>
                            <h2 className="text-2xl py-2">Items sold</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                {
                                    sold.map((nft, i) => (
                                        <div key={i} className="rounded overflow-hidden shadow-lg border border-slate-300 hover:border-pink-500">
                                            <img className="w-full object-contain h-48 object-center" src={nft.image} />
                                            <div className="px-6 py-4">
                                                <div className="font-bold text-xl mb-2 text-center">{nft.name}</div>
                                                <p className="text-gray-700 text-base">
                                                    {nft.description}
                                                </p>
                                            </div>
                                            <div className="px-6 pt-4 pb-2 text-center">
                                                <p className="text-xl mb-4 font-bold text-black">{nft.price}
                                                    <i className="fa-brands fa-ethereum ml-2"></i>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}