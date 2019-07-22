import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-dart'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-bash'

import 'github-markdown-css'
import 'prismjs/themes/prism-okaidia.css'

const langs = [
  'js',
  'javascript',
  'html',
  'dart',
  'swift',
  'python',
  'kotlin',
  'go',
  'bash',
]

const md = new MarkdownIt({
  html: true,
  langPrefix: 'language-',
  highlight: (str = '', lang) => {
    let hl = str
    if (!langs.includes(lang)) {
      return `<pre class="language-${lang}"><code class="language-${lang}">${hl}</code></pre>`
    }
    try {
      hl = Prism.highlight(str, Prism.languages[lang || 'js'], lang)
    } catch (error) {
      console.error(error)
      hl = md.utils.escapeHtml(str)
    }

    return `<pre class="language-${lang}"><code class="language-${lang}">${hl}</code></pre>`
  },
})

export default md
