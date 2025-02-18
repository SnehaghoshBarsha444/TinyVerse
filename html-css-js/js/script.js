 async function shortenURL() {
            let url = document.getElementById('urlInput').value;
            if (!url) {
                alert("Please enter a valid URL");
                return;
            }
            
            try {
                let response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
                let shortURL = await response.text();
                document.getElementById('shortenedURL').value = shortURL;
            } catch (error) {
                alert("Failed to shorten URL");
            }
        }

        function copyURL() {
            let shortURL = document.getElementById('shortenedURL');
            if (!shortURL.value) {
                alert("No URL to copy");
                return;
            }
            shortURL.select();
            document.execCommand("copy");
            alert("URL copied to clipboard");
        }

        function openURL() {
            let shortURL = document.getElementById('shortenedURL').value;
            if (!shortURL) {
                alert("No URL to open");
                return;
            }
            window.open(shortURL, '_blank');
        }
    
