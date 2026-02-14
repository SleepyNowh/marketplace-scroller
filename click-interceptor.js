
(function() {
  console.log('Marketplace click interceptor loaded');
  
  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'marketplace-url-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999999;
    `;
    
    const content = document.createElement('div');
    content.id = 'modal-content';
    
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    content.style.cssText = `
      background: ${isDarkMode ? '#1e1e1e' : '#ffffff'};
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
    
    const qrCode = document.createElement('div');
    qrCode.id = 'qr-code';
    qrCode.style.cssText = `
      background: white;
      padding: 10px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 15px;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
      padding: 10px 30px;
      font-size: 16px;
      background: ${isDarkMode ? '#3a3a3a' : '#1877f2'};
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.background = isDarkMode ? '#4a4a4a' : '#166fe5';
      closeBtn.style.transform = 'scale(1.05)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = isDarkMode ? '#3a3a3a' : '#1877f2';
      closeBtn.style.transform = 'scale(1)';
    };
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      console.log('QR modal closed - scrolling will resume');
    };
    
    content.appendChild(qrCode);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const dark = e.matches;
        content.style.background = dark ? '#1e1e1e' : '#ffffff';
        closeBtn.style.background = dark ? '#3a3a3a' : '#1877f2';
      });
    }
    
    return modal;
  }
  
  let modal = null;
  
  function showQRCode(url) {
    if (!modal) {
      modal = createModal();
    }
    
    const qrCode = document.getElementById('qr-code');
    qrCode.innerHTML = '';
    
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
    qrImg.style.cssText = 'width: 180px; height: 180px; display: block;';
    qrCode.appendChild(qrImg);
    
    modal.style.display = 'block';
    console.log('QR modal opened - scrolling paused');
  }
  
  document.addEventListener('click', function(e) {
    let target = e.target;
    let link = null;
    
    for (let i = 0; i < 10; i++) {
      if (!target) break;
      
      if (target.tagName === 'A' && target.href && target.href.includes('/marketplace/item/')) {
        link = target;
        break;
      }
      
      target = target.parentElement;
    }
    
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      showQRCode(link.href);
      console.log('Intercepted click to:', link.href);
      return false;
    }
  }, true);
  
  document.addEventListener('mousedown', function(e) {
    let target = e.target;
    let link = null;
    
    for (let i = 0; i < 10; i++) {
      if (!target) break;
      
      if (target.tagName === 'A' && target.href && target.href.includes('/marketplace/item/')) {
        link = target;
        break;
      }
      
      target = target.parentElement;
    }
    
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
  
})();
