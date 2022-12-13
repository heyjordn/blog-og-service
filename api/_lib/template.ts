
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = '#1B1D30';
        foreground = 'white';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        height: 100vh;
        width: 100vw;
        display: flex;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 auto;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1;
        font-weight: 900;
        margin-left: 50px;
        margin-top: -10px;
    }
    
    .sub-heading {
        font-family: 'Inter', sans-serif;
        font-size: 90px;
        font-style: normal;
        margin-bottom: 0px;
        color: ${foreground};
    }
    .current-link {
        font-family: 'Open Sans', sans-serif;
        font-size: 50px;
        font-style: light;
        font-weight: 100;
        margin-top: 0px;
        margin-left: 10px;
        color: ${foreground};
        opacity: 0.5;
    }
    `;

}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, path, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
    <html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body style="display:flex; flex-direction: column; justify-content:space-between; margin-left:30px;">
            <div style="display:flex; flex-grow: 1; width: 100%;">
                <div style="width: 50%;">
                    <h1 class="heading">
                    ${emojify(
                    md ? marked(text) : sanitizeHtml(text)
                    )}
                    </h1>
                </div>
                <div style="display:flex; width: 50%;align-items: center; justify-content: center;">
                    ${images.map((img, i) =>
                        getImage(img, widths[i], heights[i])
                    ).join('')}
                </div>
            </div>
            <div style="display: flex;align-items: center;">
                <div>
                    <img style="height:150px;border-radius: 100%;margin-right: 50px;margin-left: 50px;" src="https://avatars.githubusercontent.com/u/4820517?v=4" alt="heyjordn">            
                </div>
                <div>
                    <p class="sub-heading">Jordan Jones</p>
                    <p class="current-link">heyjordn.com${path}</p>
                </div>
            </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '600') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}
