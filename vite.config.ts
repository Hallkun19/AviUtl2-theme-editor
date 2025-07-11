import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Reactプラグインのインポートを追加
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Reactプラグインを有効化

  // ★★★ 最も重要な修正点 ★★★
  // GitHub Pagesで公開する際のベースパスを指定します。
  // あなたのリポジトリ名に合わせてください。
  base: "/AviUtl2-theme-editor/",

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 一般的に'./src'を指すことが多いです
    }
  }
});
