export const apiCall = async (url, method = "GET", inputData = undefined) => {
    const uri = new URL(url);
    const payload = {};
    payload.method = method;
    if (inputData) payload.body = JSON.stringify(inputData)

    const res = await fetch(uri, payload)
    if (res.status === 200) {
        let response;
        try {
            response = await res.json();
        } catch (e) {
            console.error(e);
        }

        return response;
    } else {
        console.error(`There was an error fetching the data: ${res.status} (${res.statusText})`)
    }
}

// Usage: apiCall(url) 