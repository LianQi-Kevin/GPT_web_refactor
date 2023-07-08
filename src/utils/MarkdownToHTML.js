import {marked} from "marked";
import DOMPurify from 'dompurify';  // XSS过滤
import markedKatex from "marked-katex-extension";   // 支持katex公式
import extendedTables from 'marked-extended-tables';    // 支持跨列/行表格
import {markedXhtml} from "marked-xhtml";   // 修复自闭合标签
import {markedHighlight} from "marked-highlight";   // 代码高亮
import hljs from 'highlight.js';    // 代码高亮

// 导入插件
marked.use({async: false, breaks: true, gfm: true, silent: true})
marked.use(markedKatex({throwOnError: false}))
marked.use(extendedTables())
marked.use(markedXhtml())
marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        const formattedCode = hljs.highlight(code, { language }).value
        return `<div class="codeArea" style="width: 10px">${formattedCode}</div>`
    }
}));

export function MarkdownToHTML(text) {
    return DOMPurify().sanitize(marked.parse(text));
}