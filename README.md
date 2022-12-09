# ブロック崩し
![タイトル画像](https://github.com/fujinov/breakout/blob/images/top.jpg)

## 概要
JavaScriptで作成。

基本的な部分は[「純粋な JavaScript を使ったブロック崩しゲーム | MDN」](https://developer.mozilla.org/ja/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript)を参考にし、自分なりに機能を追加していきました。

ノーマルなブロック崩しと合わせて、*カラーモード*というのを追加。

## 導入
「index.html」、「main.js」、「style.css」をローカルの同じディレクトリに入れ、「index.html」をクリック。  
ブラウザが起動したら「スタート」ボタンを押すとゲームが始まります。

動作はWindows10で「Chrome（108.0.5359.99）」と「Edge（108.0.1462.46 ）」で確認済み。

ただ古いブラウザだと動かない可能性があります。

## 遊び方
- キーボードの←→でパドルの移動。
- カラーモードでは、スペースキー押し下げで、パドルの色が変化。  
パドルの色とボールの色をあわせて打ち返します。
- ボールを下に落とすか、ライフがなくなるとゲームオーバー。
