
function isEmpty(obj) {
  return Array.isArray(obj) ? obj.length :
    obj // 👈 null and undefined check
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype;
}

module.exports=isEmpty;
