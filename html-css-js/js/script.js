document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const shortUrl = document.getElementById('shortUrl');
    const shortenBtn = document.getElementById('shortenBtn');
    const copyBtn = document.getElementById('copyBtn');
    const openBtn = document.getElementById('openBtn');
  
    // Function to shorten URL using TinyURL API
    async function shortenUrl(url) {
      try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to shorten URL');
        const data = await response.text();
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
  
    // Event listener for Shorten button
    shortenBtn.addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) {
        alert('Please enter a valid URL');
        return;
      }
  
      shortenBtn.disabled = true;
      shortenBtn.textContent = 'Shortening...';
  
      const shortened = await shortenUrl(url);
      
      shortenBtn.disabled = false;
      shortenBtn.textContent = 'Shorten';
  
      if (shortened) {
        shortUrl.value = shortened;
      } else {
        alert('Failed to shorten URL. Please try again.');
      }
    });
  
    // Event listener for Copy button
    copyBtn.addEventListener('click', () => {
      if (!shortUrl.value) {
        alert('No URL to copy');
        return;
      }
  
      navigator.clipboard.writeText(shortUrl.value)
        .then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 1500);
        })
        .catch(() => {
          alert('Failed to copy URL');
        });
    });
  
    // Event listener for Open button
    openBtn.addEventListener('click', () => {
      if (!shortUrl.value) {
        alert('No URL to open');
        return;
      }
      
      window.open(shortUrl.value, '_blank');
    });
  
    // Enable Enter key to trigger shortening
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        shortenBtn.click();
      }
    });
  });