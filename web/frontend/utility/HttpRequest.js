const HttpRequest = async (url, method, data) => {
    let options = {
        method: method,
        body: data
    }
    const result = await fetch(url, options);
    return result.json();
}

export default HttpRequest;