// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.updateCartDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                this.addItem(name, price);
            });
        });

        // Clear cart button
        const clearCartBtn = document.querySelector('.clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.openCheckout();
            });
        }

        // Checkout modal events
        this.bindCheckoutEvents();
    }

    addItem(name, price) {
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${name} added to cart!`, 'success');
    }

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(name, quantity) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(name);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Cart cleared!', 'info');
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTax() {
        return this.getTotal() * 0.085; // 8.5% tax
    }

    getGrandTotal() {
        return this.getTotal() + this.getTax();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const subtotalAmount = document.querySelector('.subtotal-amount');
        const taxAmount = document.querySelector('.tax-amount');
        const totalAmount = document.querySelector('.total-amount');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
            } else {
                this.items.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-name="${item.name}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-name="${item.name}">+</button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });

                // Bind quantity buttons
                cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const name = e.target.getAttribute('data-name');
                        const item = this.items.find(item => item.name === name);
                        const isPlus = e.target.classList.contains('plus');
                        
                        if (item) {
                            const newQuantity = isPlus ? item.quantity + 1 : item.quantity - 1;
                            this.updateQuantity(name, newQuantity);
                        }
                    });
                });
            }
        }

        if (cartCount) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = `${totalItems} items`;
        }

        if (subtotalAmount) {
            subtotalAmount.textContent = `$${this.getTotal().toFixed(2)}`;
        }

        if (taxAmount) {
            taxAmount.textContent = `$${this.getTax().toFixed(2)}`;
        }

        if (totalAmount) {
            totalAmount.textContent = `$${this.getGrandTotal().toFixed(2)}`;
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = this.items.length === 0;
        }
    }

    openCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.style.display = 'block';
            this.updateCheckoutSummary();
        }
    }

    updateCheckoutSummary() {
        const summaryItems = document.querySelector('.summary-items');
        const finalTotal = document.querySelector('.final-total');

        if (summaryItems) {
            summaryItems.innerHTML = '';
            this.items.forEach(item => {
                const summaryItem = document.createElement('div');
                summaryItem.className = 'summary-item';
                summaryItem.innerHTML = `
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                summaryItems.appendChild(summaryItem);
            });
        }

        if (finalTotal) {
            finalTotal.textContent = `$${this.getGrandTotal().toFixed(2)}`;
        }
    }

    bindCheckoutEvents() {
        const modal = document.getElementById('checkoutModal');
        if (!modal) return;

        // Close modal
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Cancel order
        const cancelBtn = modal.querySelector('.cancel-order');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
    }

    processOrder() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData);

        // Add cart items to order data
        orderData.items = this.items;
        orderData.total = this.getGrandTotal();

        // Show loading state
        const submitBtn = form.querySelector('.place-order');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Simulate order processing
        setTimeout(() => {
            // Success
            this.showNotification('Order placed successfully! We\'ll contact you shortly.', 'success');
            
            // Clear cart
            this.clearCart();
            
            // Close modal
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            console.log('Order Data:', orderData);
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-family: 'Poppins', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const cart = new ShoppingCart();
    
    // Make cart globally accessible
    window.shoppingCart = cart;
}); 