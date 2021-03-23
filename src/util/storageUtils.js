
// 或者通过store库来完成此功能

export const saveStorage = (user,USRE_KEY) => {
  localStorage.setItem(USRE_KEY,JSON.stringify(user))
}

export const getStorage = (USRE_KEY) => {
  return JSON.parse(localStorage.getItem(USRE_KEY)) || {}
}

export const removeStorage = (USRE_KEY) => {
  localStorage.removeItem(USRE_KEY)
}

