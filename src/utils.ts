export const trace = Function.prototype.bind.call(()=>{}, console);// console.log, console);
export const traceCurrent = Function.prototype.bind.call(console.log, console);

