import { useEffect, useMemo, useState } from "react";
import "./App.css";

// const initialProducts = [
//   {
//     id: 1,
//     name: "Wireless Headphones",
//     category: "Electronics",
//     price: 4500,
//     oldPrice: 6500,
//     rating: 4.8,
//     reviews: 124,
//     badge: "Best Seller",
//     image:
//       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 2,
//     name: "Smart Watch",
//     category: "Accessories",
//     price: 6500,
//     oldPrice: 9000,
//     rating: 4.7,
//     reviews: 98,
//     badge: "New",
//     image:
//       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 3,
//     name: "Mechanical Keyboard",
//     category: "Electronics",
//     price: 5500,
//     oldPrice: 7500,
//     rating: 4.6,
//     reviews: 76,
//     badge: "Popular",
//     image:
//       "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 4,
//     name: "Wireless Mouse",
//     category: "Accessories",
//     price: 2500,
//     oldPrice: 3500,
//     rating: 4.5,
//     reviews: 62,
//     badge: "",
//     image:
//       "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 5,
//     name: "Laptop",
//     category: "Electronics",
//     price: 85000,
//     oldPrice: 95000,
//     rating: 4.9,
//     reviews: 45,
//     badge: "Hot Deal",
//     image:
//       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 6,
//     name: "Travel Backpack",
//     category: "Fashion",
//     price: 3800,
//     oldPrice: 5000,
//     rating: 4.6,
//     reviews: 51,
//     badge: "Limited Stock",
//     image:
//       "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 7,
//     name: "Running Sneakers",
//     category: "Fashion",
//     price: 7200,
//     oldPrice: 9000,
//     rating: 4.7,
//     reviews: 88,
//     badge: "",
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
//   },
//   {
//     id: 8,
//     name: "Modern Table Lamp",
//     category: "Home",
//     price: 3200,
//     oldPrice: 4200,
//     rating: 4.4,
//     reviews: 39,
//     badge: "",
//     image:
//       "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
//   },
// ];

const categories = [
  { name: "All", icon: "✦" },
  { name: "Electronics", icon: "⌘" },
  { name: "Accessories", icon: "◉" },
  { name: "Fashion", icon: "◇" },
  { name: "Home", icon: "⌂" },
];

const money = (amount) => `Rs. ${amount.toLocaleString("en-PK")}`;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch("http://localhost:5000/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Unexpected products API response");
        }

        const normalizedProducts = result.data.map((product) => ({
          ...product,
          id: product._id,
          oldPrice: null,
          reviews: 0,
          badge: product.featured ? "Featured" : "",
        }));

        setProducts(normalizedProducts);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Products fetch failed:", error);
          setApiError(
            "Products load nahi ho sake. Backend server check karke dobara try karo."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to cart`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function updateQuantity(productId, change) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((item) => item.id !== productId));
  }

  function toggleWishlist(productId) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function checkout() {
    setNotice("Checkout will be connected to the backend later.");
    setCartOpen(false);
    window.setTimeout(() => setNotice(""), 3000);
  }

  return (
    <div className="store">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="ShopEase home">
          <span className="brand-icon">S</span>
          <span className="brand-copy">
            <strong>
              Shop<span>Ease</span>
            </strong>
            <small>Better Products. Happier You.</small>
          </span>
        </a>

        <label className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search products, brands and more..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
          <kbd>/</kbd>
        </label>

        <nav className="desktop-nav">
          <a className="nav-active" href="#home">
            Home
          </a>
          <a href="#products">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#footer">About</a>
        </nav>

        <div className="header-actions">
          <button
            className={`icon-button ${wishlist.length ? "is-liked" : ""}`}
            onClick={() => {
              setActiveCategory("All");
              setSearch("");
              document.getElementById("products")?.scrollIntoView({
                behavior: "smooth",
              });
              setNotice(
                wishlist.length
                  ? `${wishlist.length} product(s) in your wishlist`
                  : "Your wishlist is empty"
              );
              window.setTimeout(() => setNotice(""), 2500);
            }}
            aria-label="Wishlist"
            title="Wishlist"
          >
            ♡
          </button>

          <button
            className="icon-button cart-trigger"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${cartCount} items`}
            title="Shopping cart"
          >
            ♧<span className="cart-badge">{cartCount}</span>
          </button>

          <button
            className="icon-button account-button"
            onClick={() => {
              setNotice("Account registration will be added later.");
              window.setTimeout(() => setNotice(""), 2500);
            }}
            aria-label="Account"
            title="Account"
          >
            ♙
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <span className="deal-pill">
              ✦ &nbsp; YOUR EVERYDAY MARKETPLACE
            </span>
            <h1>
              Upgrade Your
              <br />
              <span>Everyday Essentials.</span>
            </h1>
            <p>
              Discover top-quality products at prices you'll love. Shop smarter,
              live better.
            </p>
            <a className="primary-button hero-button" href="#products">
              Shop Now <span>→</span>
            </a>

            <div className="hero-benefits">
              <div>
                <span className="benefit-icon">↗</span>
                <span>
                  <strong>Free Shipping</strong>
                  <small>On orders over Rs. 5,000</small>
                </span>
              </div>
              <div>
                <span className="benefit-icon">◇</span>
                <span>
                  <strong>Secure Shopping</strong>
                  <small>A smooth shopping experience</small>
                </span>
              </div>
              <div>
                <span className="benefit-icon">☏</span>
                <span>
                  <strong>Customer Support</strong>
                  <small>We're here to help</small>
                </span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-glow" />
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=90"
              alt="Premium wireless headphones"
            />
            <div className="floating-note">
              <span>Curated for you</span>
              <strong>Everyday, upgraded.</strong>
            </div>
            <span className="hero-orbit orbit-one" />
            <span className="hero-orbit orbit-two" />
          </div>
        </section>

        <section className="category-section" id="categories">
          <div className="category-heading">
            <div>
              <span className="eyebrow">EXPLORE OUR WORLD</span>
              <h2>Shop by category</h2>
            </div>
            <span className="muted-text">Find just what you need</span>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-chip ${
                  activeCategory === category.name ? "selected" : ""
                }`}
                onClick={() => {
                  setActiveCategory(category.name);
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <span className="category-symbol">{category.icon}</span>
                <span>{category.name}</span>
                <span className="category-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="products-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOU</span>
              <h2>
                Featured Products<span className="heading-dot">.</span>
              </h2>
              <p>Good finds. Great prices. All in one place.</p>
            </div>

            <div className="product-count">
              <span className="count-dot" />
              {filteredProducts.length} products
            </div>
          </div>

          <div className="filter-row">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`filter-chip ${
                  activeCategory === category.name ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-products">
              <h3>Loading products...</h3>
              <p>Please wait while we fetch products from the database.</p>
            </div>
          ) : apiError ? (
            <div className="empty-products">
              <h3>Unable to load products</h3>
              <p>{apiError}</p>
              <button
                className="primary-button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const discount =
                  product.oldPrice && product.oldPrice > product.price
                    ? Math.round(
                        ((product.oldPrice - product.price) /
                          product.oldPrice) *
                          100
                      )
                    : null;

                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />

                      {product.badge && (
                        <span
                          className={`product-badge badge-${product.badge
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {product.badge}
                        </span>
                      )}

                      <button
                        className={`wishlist-button ${
                          wishlist.includes(product.id) ? "liked" : ""
                        }`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`${
                          wishlist.includes(product.id)
                            ? "Remove from"
                            : "Add to"
                        } wishlist: ${product.name}`}
                      >
                        {wishlist.includes(product.id) ? "♥" : "♡"}
                      </button>
                    </div>

                    <div className="product-details">
                      <span className="product-category">
                        {product.category}
                      </span>
                      <h3>{product.name}</h3>

                      <div className="rating-line">
                        <span className="star">★</span>
                        <strong>{product.rating}</strong>
                        <span>({product.reviews} reviews)</span>
                      </div>

                      <div className="price-row">
                        <div className="price-group">
                          <strong>{money(product.price)}</strong>
                          {product.oldPrice && (
                          <del>{money(product.oldPrice)}</del>
                          )}
                        </div>
                        {discount !== null && (
                        <span className="discount-badge">{discount}% OFF</span>
)}
                      </div>

                      <button
                        className="add-button"
                        onClick={() => addToCart(product)}
                      >
                        <span>＋</span> Add to Cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-products">
              <span>⌕</span>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="newsletter">
          <div>
            <span className="eyebrow">THE GOOD STUFF, FIRST</span>
            <h2>A little something for your inbox.</h2>
            <p>Stay tuned for new arrivals and special offers.</p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice("Thanks! Newsletter signup will be connected later.");
              window.setTimeout(() => setNotice(""), 2800);
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              required
            />
            <button className="primary-button" type="submit">
              Join us →
            </button>
          </form>
        </section>
      </main>

      <footer className="footer" id="footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#home">
            <span className="brand-icon">S</span>
            <span className="brand-copy">
              <strong>
                Shop<span>Ease</span>
              </strong>
              <small>Better Products. Happier You.</small>
            </span>
          </a>

          <div className="footer-column">
            <strong>Explore</strong>
            <a href="#home">Home</a>
            <a href="#products">Shop all</a>
            <a href="#categories">Categories</a>
          </div>

          <div className="footer-column">
            <strong>Customer care</strong>
            <a href="#footer">Contact us</a>
            <a href="#footer">Shipping information</a>
            <a href="#footer">Returns & refunds</a>
          </div>

          <div className="footer-column">
            <strong>Our promise</strong>
            <span>Thoughtful finds</span>
            <span>Simple shopping</span>
            <span>Made for everyday</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ShopEase. All rights reserved.</span>
          <span>Designed with care.</span>
        </div>
      </footer>

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}

      {cartOpen && (
        <div
          className="drawer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false);
          }}
        >
          <aside className="cart-drawer" aria-label="Shopping cart">
            <div className="drawer-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>
                  Your Cart <span>({cartCount})</span>
                </h2>
              </div>
              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">♧</div>
                <h3>Your cart is taking a break.</h3>
                <p>Add something you love and it'll show up here.</p>
                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  Explore products
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <span>{item.category}</span>
                        <h3>{item.name}</h3>
                        <strong>{money(item.price)}</strong>

                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <strong className={subtotal >= 5000 ? "free-shipping" : ""}>
                      {subtotal >= 5000 ? "Free" : "Calculated later"}
                    </strong>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <button
                    className="primary-button checkout-button"
                    onClick={checkout}
                  >
                    Continue to Checkout <span>→</span>
                  </button>
                  <button
                    className="continue-button"
                    onClick={() => setCartOpen(false)}
                  >
                    ← Continue shopping
                  </button>
                  <p className="cart-note">Secure shopping · Made simple</p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
