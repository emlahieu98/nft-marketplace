import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  nftAddress, nftMarketAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { faEthernet } from '@fortawesome/free-solid-svg-icons'

let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftAddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-2xl text-center">No items in marketplace</h1>)
  return (
    <div className="container mx-auto">
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
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
                <button className=" bg-cyan-400 hover:bg-pink-500 text-white font-bold py-2 px-12 rounded w-80 " onClick={() => buyNft(nft)}>Buy</button>

              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}