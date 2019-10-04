const eventPostRequest = (params) => {
  return { 
    ...params,
    headers: 
          { 
            'Content-Type': 'application/json', 
          },
    resource: '/{proxy*}', 
  };

};

module.exports = {
  eventPostRequest
};