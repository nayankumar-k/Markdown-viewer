// Minimal Markdown Viewer
// Directly renders markdown files in the browser

(function() {
    'use strict';
    
    // Check if libraries are loaded
    if (typeof window.markdownit === 'undefined') {
        console.error('markdown-it library not available');
        return;
    }
    
    // Initialize markdown-it with syntax highlighting
    const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function(str, lang) {
            if (lang && typeof window.hljs !== 'undefined' && window.hljs.getLanguage(lang)) {
                try {
                    return window.hljs.highlight(str, { language: lang }).value;
                } catch (__) {}
            }
            if (typeof window.hljs !== 'undefined') {
                try {
                    return window.hljs.highlightAuto(str).value;
                } catch (__) {}
            }
            return str;
        }
    });
    
    // Add emoji plugin if available
    if (typeof window.markdownitEmoji !== 'undefined' && window.markdownitEmoji) {
        try {
            if (typeof window.markdownitEmoji.full === 'function') {
                md.use(window.markdownitEmoji.full);
            } else if (typeof window.markdownitEmoji === 'function') {
                md.use(window.markdownitEmoji);
            }
        } catch (e) {
            console.warn('Emoji plugin load failed:', e.message);
        }
    }
    
    // Get markdown content from the page
    const preElement = document.querySelector('pre');
    let markdownContent = '';
    
    if (preElement) {
        markdownContent = preElement.textContent;
    } else {
        const clone = document.documentElement.cloneNode(true);
        clone.querySelectorAll('script, style').forEach(s => s.remove());
        markdownContent = clone.textContent.trim();
    }
    
    // Render markdown to HTML
    const renderedHTML = md.render(markdownContent);
    
    // Apply styles directly to document
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fafafa;
            padding: 20px;
        }
        
        body {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 0;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin: 1em 0 0.5em 0;
        }
        
        h1 {
            font-size: 2.5em;
            padding-bottom: 0.3em;
            border-bottom: 2px solid #e0e0e0;
        }
        
        h2 {
            font-size: 2em;
            padding-bottom: 0.2em;
            border-bottom: 1px solid #e0e0e0;
        }
        
        h3 {
            font-size: 1.5em;
        }
        
        p {
            margin: 0.5em 0;
        }
        
        a {
            color: #0066cc;
            text-decoration: none;
            border-bottom: 1px dotted #0066cc;
        }
        
        a:hover {
            color: #0052a3;
            border-bottom-color: #0052a3;
        }
        
        code {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            color: #d63384;
        }
        
        pre {
            background-color: #282c34;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
            line-height: 1.4;
        }
        
        pre code {
            background-color: transparent;
            padding: 0;
            color: #abb2bf;
            font-size: 0.9em;
        }
        
        blockquote {
            border-left: 4px solid #007bff;
            padding-left: 15px;
            margin: 1em 0;
            color: #666;
            font-style: italic;
        }
        
        ul, ol {
            margin: 1em 0 1em 2em;
        }
        
        li {
            margin: 0.5em 0;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        
        table th,
        table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        table th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        
        table tr:nth-child(even) {
            background-color: #fafafa;
        }
        
        table tr:hover {
            background-color: #f0f0f0;
        }
        
        img {
            max-width: 100%;
            height: auto;
            margin: 1em 0;
        }
        
        hr {
            border: none;
            border-top: 2px solid #e0e0e0;
            margin: 2em 0;
        }
    `;
    
    // Load Highlight.js CSS
    const highlightCSS = document.createElement('link');
    highlightCSS.rel = 'stylesheet';
    highlightCSS.href = chrome.runtime.getURL('lib/atom-one-dark.min.css');
    
    // Replace document content with rendered markdown
    document.head.innerHTML = '';
    document.head.appendChild(highlightCSS);
    document.head.appendChild(style);
    document.body.innerHTML = renderedHTML;
})();
