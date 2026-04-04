import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 5173,
    allowedHosts: ['dell5070l'],
    // proxy: {
    //   '/nifi': {
    //     target: 'http://192.168.0.100:8080',  // ← Nginx proxy, not NiFi directly
    //     changeOrigin: true,
    //     secure: false,
    //     ws: true,
    //   }
    // }
    // proxy: {
    //   '/nifi': {
    //     target: 'https://192.168.0.100:8443',
    //     changeOrigin: true,
    //     secure: false,        // bypasses self-signed cert on NiFi
    //     ws: true,                          // ← enable WebSocket proxying (NiFi uses WS)
    //     headers: {
    //       'X-ProxyScheme': 'http',
    //       'X-ProxyHost': '192.168.0.102',
    //       'X-ProxyPort': '5173',
    //       'X-ProxyContextPath': '/'
    //     }
    //   }
    // }
  }
})
