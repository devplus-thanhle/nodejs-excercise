function APIFeatures(query, queryString) {
  this.query = query;
  this.queryString = queryString;

  this.paginating = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);

    return this;
  };
}

module.exports = APIFeatures;
