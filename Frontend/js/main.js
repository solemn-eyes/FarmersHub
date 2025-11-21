/* Shared product list used by both index and products pages */
const products = [
    {id:1,name:'Broiler (per bird)',price:700,image:'images/broiler.svg'},
    {id:2,name:'Layer (per bird)',price:950,image:'images/layer.svg'},
    {id:3,name:'Fresh Eggs (tray of 30)',price:350,image:'images/eggs.svg'},
    {id:4,name:'Chicken Manure (25kg bag)',price:500,image:'images/manure.svg'}
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
  