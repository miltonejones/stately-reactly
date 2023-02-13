import React from 'react';

export const usePagination = (collection, {
  page = 1, 
  pageSize, 
  sortkey
}) => {
 
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageCount = Math.ceil(collection?.length / pageSize);
  const startNum = (currentPage - 1) * pageSize;
  const sorted = !sortkey 
    ? collection 
    : collection?.sort((a, b) => (a[sortkey] > b[sortkey] ? 1 : -1));
  
  const visible = sorted?.slice(startNum, startNum + pageSize);

 

  return {
    startNum,
    pageCount,
    visible,
    setCurrentPage,
    currentPage
  }
}

// non-hook version
export const getPagination = (collection,  {
  page = 1, 
  pageSize, 
  sortkey
}) => {

  const pageCount = Math.ceil(collection?.length / pageSize);
  const startNum = (page - 1) * pageSize;
  const sorted = !sortkey 
    ? collection 
    : collection?.sort((a, b) => (a[sortkey] > b[sortkey] ? 1 : -1));
  
  const visible = sorted?.slice(startNum, startNum + pageSize);



  return {
    startNum,
    pageCount,
    visible
  }

  
}