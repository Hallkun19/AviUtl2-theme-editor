import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Reactプラグインをインポート

export default defineConfig(({ mode }) => {
    // 環境変数をロード (この部分は変更なしでOKです)
    const env = loadEnv(mode, '.', '');

    return {
      // ★★★ 追加: Reactプラグインを有効にする ★★★
      // これがないとTSX/JSXが正しくコンパイルされません
      plugins: [react()],
      
      // ★★★ 追加: GitHub Pagesの公開パスを設定 ★★★
      // これが404エラーを解決する最も重要な設定です！
      base: '/AviUtl2-theme-editor/', 

      // 環境変数の設定
      // 2つ同じものを定義しているので、1つに絞りました
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      // エイリアスの設定 (変更なし)
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
