export const isHtmlString = (htmlString: string) => {
	const $temp = document.createElement('div')
	$temp.innerHTML = htmlString
	return $temp.firstChild && $temp.firstChild.nodeType === Node.ELEMENT_NODE
}
