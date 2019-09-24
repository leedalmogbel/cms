const eventPostRequestBody = (body) => {
  return { 
    body: JSON.stringify(body),
    headers: 
          { 
            'Content-Type': 'application/json', 
          },
    httpMethod: 'POST',
    path: '/api/users',
    resource: '/{proxy*}', 
  };

};

module.exports = {
  eventPostRequestBody
};