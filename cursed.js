const boot = () => {
    const blocks = document.querySelectorAll('cursed')

    blocks.forEach(block => compile(block))
}

/**
 * @param {Element} block
 */
const compile = (block) => {
    block.querySelectorAll('function').forEach(fn => compileFn(fn))

    const body = []
    Array.from(block.children).forEach(child => {
        const tag = child.tagName.toLowerCase()

        if (tag === 'function') return;

        body.push(compileTag(child))
    })

    const fn = new Function(body.join("\n"))
    fn()
}

/**
 * @param {Element} fn 
 */
const compileFn = (fn) => {
    const name = fn.getAttribute('name')
    
    const args = []
    Array.from(fn.attributes).forEach(attribute => {
        if (attribute.name === 'name') return

        args.push(attribute.name)
    })

    const body = compileBlock(fn.children)

    window[name] = new Function(...args.concat(body))
}

const compileTag = (node) => {
    const tag = node.tagName.toLowerCase();

    if (tag === 'if') {
        return compileIf(node)
    }
    
    if (tag === 'return') {
        return `return ${node.getAttribute('value')};`
    }

    if (tag === 'print') {
        return `console.log(${node.getAttribute('value')})`
    }
}

const compileBlock = (children) => {
    const body = [];
    Array.from(children).forEach(child => {
        body.push(compileTag(child))
    })
    return body.join("\n")
}

/**
 * @param {Element} node 
 */
const compileIf = (node) => {
    const condition = node.getAttribute('condition')
    const body = compileBlock(node.children)
    
    return `if (${condition}) {
        ${body}
    }`
}

document.addEventListener('DOMContentLoaded', () => {
    boot()
})