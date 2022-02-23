import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6 text-center">
        <img className="m-auto" src="https://merchant.razer.com/v3/wp-content/uploads/2015/03/manage-marketplace-banner.jpg" style={{ width: "78%", height: "280px", objectFit: "fill" }} />
        <div className="flex mt-4 justify-center">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace