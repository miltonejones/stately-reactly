const API_ENDPOINT = 'https://i16ajae1q5.execute-api.us-east-1.amazonaws.com';

// getApplicationScripts method
export const downloadApplicationScripts = async (appID) => {
  // send getApplicationScripts GET request
  const response = await fetch(API_ENDPOINT + `/scripts/${appID}`);

  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

const intercept = async (method, request, response) => {
  // if (window.location.href.indexOf('localhost') > 0) {
  // const endpoint = 'http://localhost:6009/intercept'
  // const requestOptions = {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({method, request, response}, 0, 2),
  // };
  // // send GET request
  // const res = await fetch(endpoint, requestOptions);
  // try {
  //   return await res.json();
  // } catch (e) {
  //   console.log ({e});
  //   return false;
  // }
  // }
};

// relocateComponent method
export const relocateComponent = async (ID, pageID) => {
  // send relocateComponent GET request
  const response = await fetch(API_ENDPOINT + `/move/${ID}/${pageID}`);

  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

export const getApplicationByName = async (app, page) => {
  // send GET request
  const response = await fetch(API_ENDPOINT + `/name/${app}/${page}`);
  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

export const getApplicationByID = async (id) => {
  // send GET request
  const response = await fetch(API_ENDPOINT + `/id/${id}`);
  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

export const getApplicationNames = async () => {
  // send GET request
  const response = await fetch(API_ENDPOINT + `/names`);
  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

export const getApplications = async () => {
  // send GET request
  const response = await fetch(API_ENDPOINT + `/applications`);
  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

export const getApplicationInfo = async (pagename) => {
  if (!pagename) {
    return await getApplications();
  }
  // send GET request
  const response = await fetch(API_ENDPOINT + `/info/${pagename}`);
  try {
    return await response.json();
  } catch (e) {
    console.log({ e });
    return false;
  }
};

export const setApplication = async (body) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body, 0, 2),
  };

  intercept('setApplication', body, {});
  // console.log (requestOptions.body)

  // send GET request
  const response = await fetch(API_ENDPOINT, requestOptions);
  try {
    const res = await response.json();
    return res;
  } catch (e) {
    console.log({ 'setApplication error': e });
    return false;
  }
};

export const dropObject = async (source, ID) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, ID }),
  };
  // send GET request
  const response = await fetch(`${API_ENDPOINT}/drop`, requestOptions);
  try {
    const res = await response.json();
    intercept('dropObject', { source, ID }, res);
    return res;
  } catch (e) {
    console.log({ e });
    return false;
  }
};

// getPageByPath method
export const getPageByPath = async (app, path) => {
  // send getPageByPath GET request
  const response = await fetch(API_ENDPOINT + `/page/${app}/${path}`);

  try {
    const res = await response.json();
    intercept('getPageByPath', { path }, res);
    return res;
  } catch (e) {
    console.log({ e });
    return false;
  }
};

// getPageByID method
export const getPageByID = async (ID) => {
  // send getPageByPath GET request
  const response = await fetch(API_ENDPOINT + `/page/id/${ID}`);

  try {
    const res = await response.json();
    intercept('getPageByID', { ID }, res);
    return res;
  } catch (e) {
    console.log({ e });
    return false;
  }
};
