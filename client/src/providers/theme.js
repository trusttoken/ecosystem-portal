console.log("::::: theme: BEGIN");
import React, { createContext, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(window.localStorage.theme || 'light')

  window.localStorage.theme = theme
  console.log("::::: theme: " + theme);
  console.log("::::: window.localStorage.theme: " + window.localStorage.theme);

  setTimeout(() => {
    document.getElementById('private').setAttribute('data-theme', theme)
  }, 100)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
console.log("::::: theme: END");
