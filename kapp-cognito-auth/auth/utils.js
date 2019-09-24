const Utils = () => {
  const resSuccess = (data, meta = { date: new Date() }, stringify = true) => {
    const resContent = {
      meta,
      results: data,
    };
    const response = (stringify) ? JSON.stringify(resContent) : resContent;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'X-Content-Type-Options': 'nosniff',
      },
      body: response,
    };
  };

  const resError = (errCode, errContent) => {
    const resContent = {
      message: errContent,
    };
    const response = JSON.stringify(resContent);

    return {
      statusCode: errCode,
      body: response,
    };
  };
  const IsJsonString = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  const addPadding = date => `${(`0${date}`).slice(-2)}`;

  const getDateFormatYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = addPadding(date.getMonth() + 1);
    const day = addPadding(date.getDate());

    return `${year}${month}${day}`;
  };

  const getDateFormatDashSeparatedYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = addPadding(date.getMonth() + 1);
    const day = addPadding(date.getDate());

    return `${year}-${month}-${day}`;
  };

  const getDateFormatMMDDYYYYHH = (date) => {
    const year = date.getFullYear();
    const month = addPadding(date.getMonth() + 1);
    const day = addPadding(date.getDate());
    const hour = addPadding(date.getHours());

    return `${year}${month}${day}${hour}`;
  };

  const getDaysInMonth = (startDate, endDate) => {
    // Since no month has fewer than 28 days
    const date = startDate;
    const days = [];
    while (startDate < endDate) {
      days.push(getDateFormatYYYYMMDD(date));
      date.setDate(date.getDate() + 1);
    }
    if (days.length === 0) {
      days.push(getDateFormatYYYYMMDD(startDate));
    }
    return days;
  };

  const getTableName = (prefix, paymentCategory) => {
    const date = new Date();
    date.setHours(date.getHours());
    const year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let hours = date.getUTCHours();

    month = (month < 10 ? '0' : '') + month;
    day = (day < 10 ? '0' : '') + day;
    hours = (hours < 10 ? '0' : '') + hours;
    if (paymentCategory != null) {
      return `${prefix}_${paymentCategory}_${year}${month}${day}_${hours}`;
    } if (prefix === 'cache') {
      return `${prefix}_${year}${month}${day}`;
    }
    return `${prefix}_${year}${month}${day}_${hours}`;
  };

  const getTableNameHourAhead = (prefix, paymentCategory) => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    const year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let hours = date.getUTCHours();

    month = (month < 10 ? '0' : '') + month;
    day = (day < 10 ? '0' : '') + day;
    hours = (hours < 10 ? '0' : '') + hours;
    if (paymentCategory != null) {
      return `${prefix}_${paymentCategory}_${year}${month}${day}_${hours}`;
    } if (prefix === 'cache') {
      return `${prefix}_${year}${month}${day}`;
    }
    return `${prefix}_${year}${month}${day}_${hours}`;
  };

  const chunkArray = (myArray, chunkSize) => {
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];
    let myChunk;
    for (index = 0; index < arrayLength; index += chunkSize) {
      myChunk = myArray.slice(index, index + chunkSize);
      tempArray.push(myChunk);
    }

    return tempArray;
  };

  const getUtcTimestamp = (startDate, endDate) => ({
    start_date: Math.floor((new Date(startDate)).getTime() / 1000),
    end_date: Math.floor((new Date(endDate)).getTime() / 1000),
  });


  return {
    addPadding,
    chunkArray,
    IsJsonString,
    getUtcTimestamp,
    getDateFormatYYYYMMDD,
    getDateFormatDashSeparatedYYYYMMDD,
    getDateFormatMMDDYYYYHH,
    getDaysInMonth,
    getTableName,
    getTableNameHourAhead,
    resError,
    resSuccess,
    // verifyToken
  };
};

module.exports = Utils;
