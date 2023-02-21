export const getRouteParams = (routeProps, pageParams) => {
  const parameters = {};
  // when route props are populated use those values
  if (routeProps && pageParams && typeof routeProps === 'string') {
    // assign values from route path to parameters object
    const routeProp = routeProps.split('/')
    Object.keys(pageParams).map((parameterKey, i) => {
      return parameters[parameterKey] = routeProp[i]
    } );
      
    // console.log ({ routeProp, parameters })

    return parameters; 
  }

  return {}; 
}