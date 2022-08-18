export default function isEmpty(val, options = {}) {
  let returnDetails = false;
  if(options && options.details) returnDetails=true;

  if (typeof val === 'undefined') {
    if(returnDetails) {
      return {
        value: true,
        type: 'undefined'
      };
    } else {
      return true;
    }
  }
  if (typeof val === 'boolean' && val === false) {
    if(returnDetails) {
      return {
        value: true,
        type: 'boolean'
      };
    } else {
      return true;
    }
  }
  if (val === null) {
    if(returnDetails) {
      return {
        value: true,
        type: 'null'
      };
    } else {
      return true;
    }
  }
  if (val === '') {
    if(returnDetails) {
      return {
        value: true,
        type: 'string'
      };
    } else {
      return true;
    }
  }
  if (val === 0) {
    if(returnDetails) {
      return {
        value: true,
        type: 'number'
      };
    } else {
      return true;
    }
  }
  if (val.constructor === Object && Object.keys(val).length) {
    if(returnDetails) {
      return {
        value: true,
        type: 'object'
      };
    } else {
      return true;
    }
  }
  if (Array.isArray(val) && !val.length) {
    if(returnDetails) {
      return {
        value: true,
        type: 'array'
      };
    } else {
      return true;
    }
  }
  return false;
};
