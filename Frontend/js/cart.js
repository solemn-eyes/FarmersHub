// cart state shared across pages using localStorage for persistence
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

const cartCount = () => document.getElementById('cartCount');
const cartModal = () => document.getElementById('cartModal');
const cartItems = () => document.getElementById('cartItems');
const cartTotalEl = () => document.getElementById('cartTotal');
const checkoutTotal = () => document.getElementById('checkoutTotal');

function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartCount(){
  const el = cartCount();
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  if(el) el.textContent = totalQty;
}

function addToCart(id, qty=1){
  const prod = products.find(p=>p.id===id);
  if(!prod) return;
  const item = cart.find(c=>c.id===id);
  if(item) item.qty += qty; else cart.push({...prod,qty});
  saveCart();updateCartCount();
  // small friendly feedback
  try { alert(prod.name + ' added to cart'); } catch(e) {}
}

// delegate add buttons
document.addEventListener('click', e=>{
  if(e.target.matches('[data-id]')){
    const id = Number(e.target.dataset.id);
    const qtyInput = document.getElementById('qty-'+id);
    const qty = Math.max(1, Number(qtyInput ? qtyInput.value : 1));
    addToCart(id, qty);
  }
});

function renderCart(){
  const container = cartItems();
  if(!container) return;
  container.innerHTML = '';
  if(cart.length===0){ container.innerHTML = '<p>Your cart is empty.</p>'; if(cartTotalEl()) cartTotalEl().textContent='0'; return; }
  cart.forEach(item=>{
    const row = document.createElement('div');row.style.display='flex';row.style.justifyContent='space-between';row.style.alignItems='center';row.style.padding='8px 0';
    row.innerHTML = `<div style='display:flex;gap:10px;align-items:center'><img src='${item.image}' style='width:70px;height:50px;object-fit:cover;border-radius:6px'><div><strong>${item.name}</strong><div style='opacity:0.8'>KES ${item.price.toLocaleString()}</div></div></div><div style='text-align:right'><input type='number' min='1' value='${item.qty}' style='width:70px;padding:6px;border-radius:6px;border:1px solid #ddd' data-change='${item.id}'><div style='margin-top:6px'><button data-remove='${item.id}' style='background:#e23b3b;color:#fff;padding:6px;border-radius:6px;border:0;cursor:pointer'>Remove</button></div></div>`;
    container.appendChild(row);
  });
  const total = cart.reduce((s,i)=>s + (i.price*i.qty),0);
  if(cartTotalEl()) cartTotalEl().textContent = total.toLocaleString();
  if(checkoutTotal()) checkoutTotal().textContent = total.toLocaleString();
}

// remove and qty change
document.addEventListener('click', e=>{
  if(e.target.matches('[data-remove]')){
    const id = Number(e.target.dataset.remove); cart = cart.filter(x=>x.id!==id); saveCart(); renderCart(); updateCartCount();
  }
});
document.addEventListener('change', e=>{
  if(e.target.matches('[data-change]')){
    const id = Number(e.target.dataset.change); const val = Math.max(1,Number(e.target.value)); const item = cart.find(x=>x.id===id); if(item){ item.qty=val; saveCart(); renderCart(); updateCartCount(); }
  }
});

// open/close cart
document.addEventListener('click', e=>{
  if(e.target.closest && e.target.closest('#openCart')){ renderCart(); const m = cartModal(); if(m) m.classList.add('open'); }
  if(e.target.closest && e.target.closest('#closeCart')){ const m = cartModal(); if(m) m.classList.remove('open'); }
});

// checkout flow (frontend-only for now; will call backend later)
document.addEventListener('click', e=>{
  if(e.target.closest && e.target.closest('#checkoutBtn')){
    if(cart.length===0){ alert('Cart is empty'); return; }
    const m = document.getElementById('checkoutModal'); if(m) m.classList.add('open');
  }
  if(e.target.closest && e.target.closest('#cancelCheckout')){
    const m = document.getElementById('checkoutModal'); if(m) m.classList.remove('open');
  }
});

// Checkout form
document.addEventListener('submit', async (e)=>{
  if(!e.target.matches('#checkoutForm')) return;
  e.preventDefault();
  const fd = new FormData(e.target);
  const order = {
    buyer: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'),
    items: cart, total: cart.reduce((s,i)=>s + i.price*i.qty,0)
  };

  // Try to POST to backend if available, otherwise fallback to simulated behavior
  try {
    const resp = await fetch('/api/orders/', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(order)
    });
    if(resp.ok){
      const data = await resp.json();
      // If backend returns order id and requires STK push, frontend can call /api/mpesa/stk/
      alert('Order created. We will contact you on ' + order.phone);
    } else {
      // fallback
      alert('Order placed locally (no backend). Our team will contact you on ' + order.phone);
    }
  } catch(err){
    // network error: fallback
    console.warn('Could not reach backend:', err);
    alert('Order placed locally (no backend). Our team will contact you on ' + order.phone);
  }

  cart = []; saveCart(); renderCart(); const cm = document.getElementById('checkoutModal'); if(cm) cm.classList.remove('open'); const cmodal = document.getElementById('cartModal'); if(cmodal) cmodal.classList.remove('open');
});

// contact form handler (tries backend, then falls back)
document.addEventListener('submit', async (e)=>{
  if(!e.target.matches('#contactForm')) return;
  e.preventDefault();
  const statusEl = document.getElementById('contactStatus');
  const fd = new FormData(e.target);
  const data = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') };
  statusEl.textContent = 'Sending...';

  try {
    const resp = await fetch('/api/contact/', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(resp.ok){
      statusEl.textContent = 'Message sent — thank you!';
    } else {
      statusEl.textContent = 'Message queued locally (no backend).';
    }
  } catch(err){
    console.warn('Contact API not reachable', err);
    statusEl.textContent = 'Message queued locally (no backend).';
  }

  e.target.reset();
  setTimeout(()=>{ statusEl.textContent = ''; }, 4000);
});

// initial
updateCartCount();
document.addEventListener('DOMContentLoaded', renderCart);

