/* Shared product list used by both index and products pages */
const products = [
    {id:1,name:'Broiler (per bird)',price:700,image:'https://images.unsplash.com/photo-1547444361-9b0f7b9c9d29?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:2,name:'Layer (per bird)',price:950,image:'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s='},
    {id:3,name:'Fresh Eggs (tray of 30)',price:350,image:'https://www.citypng.com/public/uploads/preview/-11596307294h1l6kpc9pm.png'},
    {id:4,name:'Chicken Manure (25kg bag)',price:500,image:'https://gratisography.com/wp-content/uploads/2018/01/free-range-chicken-farm.jpg'}
  ];
  
  function renderProductsGrid(containerId='productGrid'){
    const grid = document.getElementById(containerId);
    if(!grid) return;
    grid.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('div');card.className='card';
      card.innerHTML = `<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><div class="price">KES ${p.price.toLocaleString()}</div><div style="display:flex;gap:8px;margin-top:8px"><input type='number' min='1' value='1' style='width:80px;padding:6px;border-radius:6px;border:1px solid #ddd' id='qty-${p.id}'><button data-id='${p.id}'>Add to cart</button></div>`;
      grid.appendChild(card);
    });
  }
  
  // render on load
  window.addEventListener('DOMContentLoaded', ()=>{
    renderProductsGrid();
  });
  