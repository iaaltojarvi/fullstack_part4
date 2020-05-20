const info = async (...params) => {
    await console.log(...params)
  }
  
  const error = async (...params) => {
    await console.error(...params)
  }
  
  module.exports = {
    info, error
  }