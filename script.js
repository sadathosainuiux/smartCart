
document.addEventListener('DOMContentLoaded', () => {
    console.log("SmartCart loaded successfully!");

    const productGrid = document.getElementById('product-grid');

    if (productGrid) {
        initializeProductPage();
    }

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-primary');
        if (btn && btn.innerText.includes('Add')) {
            const originalText = btn.innerHTML;
           
            btn.style.width = getComputedStyle(btn).width;

            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Added';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.width = '';
            }, 2000);
        }
    });
});

async function initializeProductPage() {
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allProducts = [];

    // Fetch Products
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        productGrid.innerHTML = `<div class="col-span-full text-center text-red-500">Failed to load products. Please try again later.</div>`;
        console.error('Error fetching products:', error);
    }

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'text-white');
                b.classList.add('btn-outline');
            });
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary', 'text-white');

            const category = btn.getAttribute('data-category');
            if (category === 'all') {
                renderProducts(allProducts);
            } else {
            
                const filtered = allProducts.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

function renderProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    if (products.length === 0) {
        productGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No products found in this category.</div>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full';

        productCard.innerHTML = `
            <figure class="px-5 pt-5 bg-gray-50 h-64 flex items-center justify-center">
                <img src="${product.image}" alt="${product.title}" class="h-48 object-contain" />
            </figure>
            <div class="card-body flex-grow">
                <div class="flex justify-between items-start mb-2">
                     <div class="badge badge-primary badge-outline text-xs truncate max-w-[50%]">${product.category}</div>
                     <div class="text-yellow-500 text-sm flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ${product.rating && product.rating.rate ? product.rating.rate : 'N/A'} (${product.rating && product.rating.count ? product.rating.count : 0})
                     </div>
                </div>
                <h2 class="card-title text-base leading-snug line-clamp-2" title="${product.title}">${product.title}</h2>
                <p class="font-bold text-xl mt-auto pt-2">$${product.price}</p>
                <div class="card-actions justify-between items-center mt-4">
                    <button class="btn btn-sm btn-outline btn-ghost w-[45%]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Details
                    </button>
                    <button class="btn btn-sm btn-primary w-[45%] text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Add
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}
