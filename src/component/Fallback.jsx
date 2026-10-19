import './Fallback.css'

const skeletonProducts = Array.from({ length: 8 }, (_, index) => index)

export default function Fallback() {
  return (
    <section className="products-loading" aria-labelledby="loading-title" aria-busy="true">
      <div className="products-loading__intro">
        <h1 id="loading-title">Discover our products</h1>
        <p>Loading products…</p>
      </div>

      <div className="products-loading__grid" role="status" aria-label="Loading products">
        {skeletonProducts.map((product) => (
          <div className="product-skeleton" key={product} aria-hidden="true">
            <div className="product-skeleton__image" />
            <div className="product-skeleton__details">
              <div className="product-skeleton__line product-skeleton__line--title" />
              <div className="product-skeleton__line product-skeleton__line--subtitle" />
              <div className="product-skeleton__line product-skeleton__line--price" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
