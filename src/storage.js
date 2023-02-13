import { map } from "./util/map";

class DynamoStorage {
    endpoint = 'https://storage.puppeteerstudio.com';
    
    /**
     * reads all items for a given auth_key from the dynamo table
     * @param {string} auth_key - identifier for the current user
     * @returns array of items
     */
    async getItems(auth_key) {
      // send GET request
      const response = await fetch(this.endpoint + `/${auth_key}`);
      return await response.json();
    }
    
    /**
     * reads an item from the dynamo table
     * @param {string} auth_key - identifier for the current user
     * @param {string} data_key - identifing key for the selected value
     * @returns item value
     */
    async getItem(auth_key, data_key) {
      // send GET request
      const response = await fetch(this.endpoint + `/${auth_key}/${data_key}`);
      try {
        const value = await response.json();
        return atob(value)
      } catch (e) {
        console.log ({e});
        return false;
      }
    }
    
    /**
     * adds an item to the dynamo table
     * @param {string} auth_key - identifier for the current user
     * @param {string} data_key - identifing key for the selected value
     * @param {object} data_value - value to assign to this key
     * @returns object with success message
     */
    async setItem(auth_key, data_key, data_value) {
      // build request options
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_key, data_key, data_value: btoa(data_value) }),
      };
    
      // send POST request
      const response = await fetch(this.endpoint, requestOptions);
      return await response.json();
    }
    
    /**
     * deletes an item from the dynamo table
     * @param {string} auth_key - identifier for the current user
     * @param {string} data_key - identifing key for the selected value
     */
    async removeItem(auth_key, data_key) {
      // build request options
      const requestOptions = {
        method: "DELETE",
      };
    
      // send DELETE request
      const response = await fetch(
        this.endpoint + `/${auth_key}/${data_key}`,
        requestOptions
      );

      return await response.json();
    }
    
    /**
     * deletes all items from the dynamo table for the current user
     * @param {string} auth_key - identifier for the current user
     */
    async removeItems(auth_key) {
      // build request options
      const requestOptions = {
        method: "DELETE",
      };
    
      // send DELETE request
      const response = await fetch(
        this.endpoint + `/${auth_key}`,
        requestOptions
      );
      return await response.json();
    }
   }
    
   
const store = new DynamoStorage()
const useDynamoStorage = () => {

  // auth key alwas the same
  const auth_key = 'reactly';
  const app_key = 'reactly-app';

  const getItem = async(name) => { 
    const dynamoDatum = await store.getItem(auth_key, name);
    return dynamoDatum;
  }

  const getItems = async() => { 
    const dynamoDatum = await store.getItems(auth_key);
    return dynamoDatum;
  }

  const setItem = async (name, value) => await store.setItem(auth_key, name, value);




  const getProgItem = async(name) => { 
    const dynamoDatum = await store.getItem(app_key, name);
    return dynamoDatum;
  }

  const getProgItems = async() => { 
    const dynamoDatum = await store.getItems(app_key);
 


    await map(Object.keys(dynamoDatum), async (key) => {

       const app = JSON.parse(atob(dynamoDatum[key]));

       if (!app.pages) {
        
        const page_key = `${app_key}-app-${app.ID}`;
        const pages = await store.getItems(page_key);
        Object.assign(app, { pages: []});

        !!pages && Object.keys(pages).map(leaf => {
          const page = JSON.parse(atob(pages[leaf]));
          const { dirty, ...rest} = page;
          return app.pages.push(rest);  
        });

        
        Object.assign(dynamoDatum, { [key]: btoa(JSON.stringify(app))})
        console.log ({ app, pages , dynamoDatum})
      }

    })

    console.log ({  dynamoDatum})

    return dynamoDatum;
  }

  const setProgItem = async (name, value) => {
    
    const { pages, ...rest} = value;

    await map(pages, async (page) => {
      if (page.dirty) {
        console.log ({ dirty: page.dirty})
        const { dirty, ...rest} = page;
        const page_key = `${app_key}-${name}`;
        await store.setItem(page_key, 'subpage-' + page.ID, JSON.stringify(rest));
      }
    })
     await store.setItem(app_key, name, JSON.stringify(rest));
  //  alert (JSON.stringify(res))
  }
  
  const removeProgItem = async (name) => await store.removeItem(app_key, name);
  

  return { getItem, setItem, getItems, getProgItem, getProgItems, setProgItem , removeProgItem}
}   

export default useDynamoStorage;