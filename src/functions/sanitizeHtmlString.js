
export const sanitizeHtmlString = unsafeString => {
    const htmlElementRegex = /(<[^>]+>)/ // matches anything between "<>" to detect html elements
    const unsafeElementArray = unsafeString.split(htmlElementRegex)

    const elementWhitelist = [
        "<a>", // allows for link closing tags
        "<a ", // allows links to have attributes
        "<br>",
        "<strong>",
        "<i>",
    ]
    
    // quick helper function to check if a string starts with any of an array of substrings
    const startsWithArray = (str, arr) => {
        return arr.some(substr => str.startsWith(substr))
    }

    const elementsToRemove = unsafeElementArray.filter(element => {
        return element.substring(0,1) === "<" &&
        !startsWithArray(element, elementWhitelist) &&
        !startsWithArray(element.replace('/', ''), elementWhitelist)            
    })

    const isLinkClean = element => {
        const safeElement = /(<a *href="https:[^:]+" *>)/
        return (element.match(safeElement)) ? true : false
    }

    const safeElementArray = unsafeElementArray.filter(element => {
        return (elementsToRemove.indexOf(element) === -1 || (element.startsWith("<a") && !isLinkClean(element)) ? true : false)
    })

    const sanitizedString = safeElementArray.join("")
    return sanitizedString;
}