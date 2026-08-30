import './styles/main.css'
import { mountApp } from './App'

console.info(`Summit v${__APP_VERSION__} starting`)

const root = document.getElementById('app')
if (root) {
  mountApp(root)
}
