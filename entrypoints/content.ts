import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
  matches: ['https://www.linkedin.com/*'],
  main() {
    console.log('LinkedIn AI Reply extension loaded');

    // Function to inject and initialize React app
    function injectReactApp() {
      const root = document.createElement('div');
      root.id = 'linkedin-ai-reply-root';
      document.body.appendChild(root);

      // Dynamically import the React app
      import('../src/content-script/index').then(() => {
        console.log('React app loaded');
      }).catch(error => {
        console.error('Failed to load React app:', error);
      });
    }

    // Set up MutationObserver to detect when we're on a messaging page
    const observer = new MutationObserver(() => {
      const messageInput = document.querySelector('div[contenteditable="true"][aria-label*="message"]');
      if (messageInput && !document.getElementById('linkedin-ai-reply-root')) {
        injectReactApp();
        observer.disconnect(); // Stop observing once we've injected the app
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});