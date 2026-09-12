export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function nextCartCount(current) {
  return current + 1;
}

export function menuShouldClose(key) {
  return key === 'Escape';
}

export function renderProductCards(products) {
  if (!products.length) {
    return '<p class="empty-state" role="status">The next collection is being prepared. Please check back soon.</p>';
  }

  return products.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" width="900" height="1125" alt="${product.alt}" loading="lazy" />
      </div>
      <div class="product-details">
        <div><h3>${product.name}</h3><p>${product.description}</p></div>
        <span class="product-price">$${product.price.toFixed(2)}</span>
      </div>
      <button class="add-button" type="button" data-add-to-cart="${product.id}">Add to cart</button>
    </article>
  `).join('');
}

const products = [
  {
    id: 'graphic-tee',
    name: 'Motion Graphic Tee',
    price: 32,
    description: 'Heavyweight cotton, relaxed fit.',
    image: 'https://picsum.photos/seed/wind-graphic-tee/900/1125',
    alt: 'Graphic tee folded on a pink surface',
  },
  {
    id: 'studio-cap',
    name: 'Studio Cap',
    price: 28,
    description: 'Unstructured six-panel cap.',
    image: 'https://picsum.photos/seed/wind-studio-cap/900/1125',
    alt: 'Dark cap resting on a desk',
  },
  {
    id: 'after-hours-print',
    name: 'After Hours Print',
    price: 24,
    description: 'Risograph-inspired A3 art print.',
    image: 'https://picsum.photos/seed/wind-after-hours-print/900/1125',
    alt: 'Pink graphic art print on a wall',
  },
  {
    id: 'everyday-tote',
    name: 'Everyday Tote',
    price: 20,
    description: 'Sturdy canvas with a long handle.',
    image: 'https://picsum.photos/seed/wind-everyday-tote/900/1125',
    alt: 'Canvas tote bag beside a chair',
  },
];

function setExpanded(toggle, panel, expanded) {
  toggle.setAttribute('aria-expanded', String(expanded));
  panel.hidden = !expanded;
}

function initializeStorefront() {
  const productGrid = document.querySelector('[data-product-grid]');
  const cartCount = document.querySelector('[data-cart-count]');
  const cartButton = document.querySelector('[data-cart-button]');
  const announcement = document.querySelector('[data-announcement]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const storeMenu = document.querySelector('[data-store-menu]');
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const newsletterForm = document.querySelector('[data-newsletter-form]');
  const newsletterMessage = document.querySelector('[data-newsletter-message]');
  const year = document.querySelector('[data-current-year]');
  let count = 0;

  if (year) year.textContent = String(new Date().getFullYear());
  if (productGrid) productGrid.innerHTML = renderProductCards(products);

  function announce(message) {
    if (announcement) announcement.textContent = message;
  }

  function closeStoreMenu() {
    if (menuToggle && storeMenu) setExpanded(menuToggle, storeMenu, false);
  }

  function closeMobileMenu() {
    if (mobileToggle && mobileMenu) setExpanded(mobileToggle, mobileMenu, false);
  }

  menuToggle?.addEventListener('click', () => {
    if (!storeMenu) return;
    setExpanded(menuToggle, storeMenu, menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileToggle?.addEventListener('click', () => {
    if (!mobileMenu) return;
    setExpanded(mobileToggle, mobileMenu, mobileToggle.getAttribute('aria-expanded') !== 'true');
  });

  document.querySelectorAll('[data-close-mobile]').forEach((link) => link.addEventListener('click', closeMobileMenu));
  document.querySelectorAll('[data-store-menu] a').forEach((link) => link.addEventListener('click', closeStoreMenu));

  document.addEventListener('keydown', (event) => {
    if (menuShouldClose(event.key)) {
      closeStoreMenu();
      closeMobileMenu();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.nav-menu')) closeStoreMenu();
  });

  productGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;

    const product = products.find((item) => item.id === button.dataset.addToCart);
    if (!product) return;

    count = nextCartCount(count);
    if (cartCount) cartCount.textContent = String(count);
    if (cartButton) cartButton.setAttribute('aria-label', `Cart, ${count} ${count === 1 ? 'item' : 'items'}`);
    announce(`${product.name} added to your cart. ${count} ${count === 1 ? 'item' : 'items'} in cart.`);
  });

  cartButton?.addEventListener('click', () => announce(`Your cart has ${count} ${count === 1 ? 'item' : 'items'}. Checkout is not available in this demo.`));

  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(newsletterForm).get('email');
    if (!newsletterMessage) return;

    if (typeof email !== 'string' || !isValidEmail(email)) {
      newsletterMessage.textContent = 'Enter a valid email address to join the list.';
      return;
    }

    newsletterMessage.textContent = 'You are on the list. We will be in touch for the next drop.';
    newsletterForm.reset();
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStorefront, { once: true });
  } else {
    initializeStorefront();
  }
}
