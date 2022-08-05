/*!
 * global debugging only logger - log everything
 * (c) 2021 IonRev Development, MIT License
 * @param  {}
 * @return {Boolean}  true or false
 */
export default (function() {
  var call = Function.prototype.call;
  Function.prototype.call = function() {
    console.log(this, arguments);
    return call.apply(this, arguments);
  };
}());
