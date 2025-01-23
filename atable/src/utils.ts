export const isHtmlString = (htmlString: string) => {
	const $document = new DOMParser().parseFromString(htmlString, 'text/html')
	return Array.from($document.body.childNodes).some(node => node.nodeType === 1)
}

export const generateHash = (length = 8) => {
	return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}
