class Request {
  baseUrl;
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  makeUrl(path) {
    return this.baseUrl + path;
  }

  async get(path, params) {
    const url = this.makeUrl(path);
    const res = await fetch(url);
    return this.createResponse(res);
  }

  async post(path, params = {}, options = { contentType: "application/json" }) {
    const url = this.makeUrl(path);
    const res = await fetch(url, {
      method: "POST",
      body: typeof params === "string" ? params : JSON.stringify(params),
      headers: {
        "Content-Type": options.contentType,
      },
    });
    return this.createResponse(res);
  }

  async createResponse(res) {
    return {
      data: await this.parseJson(res),
      res: res,
    };
  }

  async parseJson(response) {
    return response.json();
  }
}

module.exports = Request;
