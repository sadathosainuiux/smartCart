// State
let cart = JSON.parse(localStorage.getItem('smartCart')) || [];
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("SmartCart loaded successfully!");

    // Initialize Cart UI
    updateCartUI();

    // Check if we exist on the product page
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        initializeProductPage();
    } else {
        // We are on home page, maybe load trending products dynamically?
        // For now, let's just make sure global listeners work
    }

    // Global Event Listeners
    setupGlobalListeners();
});

// --- Product Page Logic ---

async function initializeProductPage() {
    const productGrid = document.getElementById('product-grid');
    const categoryContainer = document.getElementById('category-filters');

    // 1. Fetch Categories
    try {
        const catResponse = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await catResponse.json();
        renderCategories(categories, categoryContainer);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }

    // 2. Fetch All Products Initially
    try {
        const prodResponse = await fetch('https://fakestoreapi.com/products');
        allProducts = await prodResponse.json();
        renderProducts(allProducts);
    } catch (error) {
        productGrid.innerHTML = `<div class="col-span-full text-center text-red-500">Failed to load products. Please try again later.</div>`;
        console.error('Error fetching products:', error);
    }
}

function renderCategories(categories, container) {
    // Keep the "All" button
    container.innerHTML = `<button class="btn btn-sm btn-primary text-white filter-btn" data-category="all">All</button>`;

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline filter-btn capitalize';
        btn.setAttribute('data-category', cat);
        btn.innerText = cat;
        container.appendChild(btn);
    });

    // Re-attach listeners since we overwrote innerHTML
    setupCategoryListeners();
}

function setupCategoryListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            // UI Update
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'text-white');
                b.classList.add('btn-outline');
            });
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary', 'text-white');

            const category = btn.getAttribute('data-category');
            renderProductsLoading();

            if (category === 'all') {
                // If we already have all products, use them, otherwise fetch
                if (allProducts.length > 0) renderProducts(allProducts);
                else {
                    const resp = await fetch('https://fakestoreapi.com/products');
                    allProducts = await resp.json();
                    renderProducts(allProducts);
                }
            } else {
                // Fetch specific category
                try {
                    const resp = await fetch(`https://fakestoreapi.com/products/category/${category}`);
                    const products = await resp.json();
                    renderProducts(products);
                } catch (e) {
                    console.error('Error filtering', e);
                }
            }
        });
    });
}

function renderProductsLoading() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = `
        <div class="skeleton h-96 w-full"></div>
        <div class="skeleton h-96 w-full"></div>
        <div class="skeleton h-96 w-full"></div>
        <div class="skeleton h-96 w-full"></div>
    `;
}

function renderProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    if (products.length === 0) {
        productGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No products found.</div>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full';

        productCard.innerHTML = `
            <figure class="px-5 pt-5 bg-gray-50 h-64 flex items-center justify-center cursor-pointer" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.title}" class="h-48 object-contain" />
            </figure>
            <div class="card-body flex-grow">
                <div class="flex justify-between items-start mb-2">
                     <div class="badge badge-primary badge-outline text-xs truncate max-w-[50%] capitalize">${product.category}</div>
                     <div class="text-yellow-500 text-sm flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ${product.rating && product.rating.rate ? product.rating.rate : 'N/A'} (${product.rating && product.rating.count ? product.rating.count : 0})
                     </div>
                </div>
                <h2 class="card-title text-base leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors" onclick="openProductModal(${product.id})" title="${product.title}">${product.title}</h2>
                <p class="font-bold text-xl mt-auto pt-2">$${product.price}</p>
                <div class="card-actions justify-between items-center mt-4">
                    <button class="btn btn-sm btn-outline btn-ghost w-[45%]" onclick="openProductModal(${product.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Details
                    </button>
                    <button class="btn btn-sm btn-primary w-[45%] text-white" onclick="addToCart(${product.id}, event)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Add
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// --- Cart Logic ---

function setupGlobalListeners() {
    // We can rely on inline onclicks for simplicity in this generated code, 
    // or add delegation here. Sticking to inline calls (onclick="...") for explicit actions 
    // to avoid event bubbling issues with the card click vs button click.
}

window.addToCart = async function (productId, event) {
    if (event) {
        event.stopPropagation();
        // Button Feedback
        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        const originalWidth = btn.offsetWidth;
        btn.style.width = `${originalWidth}px`;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Added';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.width = '';
        }, 1500);
    }

    // Find product - check allProducts first
    let product = allProducts.find(p => p.id === productId);

    // If not in allProducts (e.g. on home page or filtered view edge case), fetch it
    if (!product) {
        try {
            const resp = await fetch(`https://fakestoreapi.com/products/${productId}`);
            product = await resp.json();
        } catch (e) {
            console.error("Error adding to cart", e);
            return;
        }
    }

    // Add to cart state
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
}

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('smartCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    const dropdownCount = document.getElementById('dropdown-items-count');
    const dropdownSubtotal = document.getElementById('dropdown-subtotal');

    // Calculate totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Badge
    if (cartCount) cartCount.innerText = totalItems;
    if (dropdownCount) dropdownCount.innerText = `${totalItems} Items`;
    if (dropdownSubtotal) dropdownSubtotal.innerText = `Subtotal: $${totalPrice.toFixed(2)}`;

    // Update Sidebar
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="text-center text-gray-500 mt-10">Your cart is empty.</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex gap-4 items-center bg-base-200 p-3 rounded-lg">
                    <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-contain bg-white rounded p-1">
                    <div class="flex-grow min-w-0">
                        <h4 class="font-bold text-sm truncate" title="${item.title}">${item.title}</h4>
                        <div class="text-xs text-gray-500">$${item.price} x ${item.quantity}</div>
                    </div>
                    <div class="font-bold text-primary">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn-ghost btn-xs text-error" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            `).join('');
        }
    }

    if (cartTotalElement) {
        cartTotalElement.innerText = `$${totalPrice.toFixed(2)}`;
    }
}

// --- Product Modal Logic ---

window.openProductModal = async function (productId) {
    const modal = document.getElementById('product_modal');
    if (!modal) return;

    // Reset/Loading state
    document.getElementById('modal-image').src = '';
    document.getElementById('modal-title').innerText = 'Loading...';
    document.getElementById('modal-description').innerText = '';

    modal.showModal();

    let product = allProducts.find(p => p.id === productId);
    if (!product) {
        try {
            const resp = await fetch(`https://fakestoreapi.com/products/${productId}`);
            product = await resp.json();
        } catch (e) {
            console.error("Error fetching details", e);
            document.getElementById('modal-title').innerText = 'Error loading product';
            return;
        }
    }

    // Populate Modal
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-category').innerText = product.category;
    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-description').innerText = product.description;
    document.getElementById('modal-price').innerText = `$${product.price}`;
    document.getElementById('modal-rating').innerText = `${product.rating.rate} (${product.rating.count})`;

    // Add to cart button in modal
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = (e) => {
        addToCart(product.id, e);
        // Optional: Close modal or show feedback
    };
}
