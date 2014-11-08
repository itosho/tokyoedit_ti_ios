(function() {
	// アプリの名前空間を分割する
	app.ui.all = {};

	// All Tokyoタブのファクトリメソッド
	app.ui.all.createAllTokyoTab = function() {
		// ウインドウ作成
		var win = Ti.UI.createWindow({
			title : 'All Tokyo Edit'
		});
		// 右上にマニュアルボタン設置
		var manualButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.INFO_LIGHT
		});
		win.rightNavButton = manualButton;
		// タブ作成
		var tab = Ti.UI.createTab({
			icon : '/img/dark/dark_stats-bars.png',
			title : 'All Tokyo',
			window : win
		});

		// マニュアルボタン押下時ダイアログ表示
		manualButton.addEventListener('click', function(e) {
			var dialog = Ti.UI.createAlertDialog({
				message : 'All Tokyoではすべての動画をストリーミング再生で視聴できます。',
				ok : 'CLOSE',
				title : 'About All Tokyo'
			}).show();
		});

		// テーブルデータ初期化
		var movies = [];
		// テーブルセクション（当面は日比谷線だけ。。。）
		var line = Ti.UI.createTableViewSection({
			headerTitle : '東京メトロ日比谷線'
		});

		// iOS7から動かなくなった！？
		// コンテンツ設定ファイル取得
		// var fileContents =
		// Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,
		// '/app/contents.json');
		// 文字列（JSON）へ変換
		// var bsonContents = fileContents.read();
		// var jsonContents = bsonContents.toString();
		// var objLine = JSON.parse(jsonContents);

		// iOS7対応（あんまりいい書き方ではないが。。。）
		// コンテンツ設定情報設定
		var objLine = {
			"hiviya" : [ {
				"file" : "hiviya_01",
				"title" : "中目黒⇒恵比寿",
				"distance" : "1.0",
				"desc" : "..."
			}, {
				"file" : "hiviya_02",
				"title" : "恵比寿⇒広尾",
				"distance" : "1.5",
				"desc" : "..."
			}, {
				"file" : "hiviya_03",
				"title" : "広尾⇒六本木",
				"distance" : "1.7",
				"desc" : "..."
			}, {
				"file" : "hiviya_04",
				"title" : "六本木⇒神谷町",
				"distance" : "1.5",
				"desc" : "..."
			}, {
				"file" : "hiviya_05",
				"title" : "神谷町⇒霞ヶ関",
				"distance" : "1.3",
				"desc" : "..."
			}, {
				"file" : "hiviya_06",
				"title" : "霞ヶ関⇒日比谷",
				"distance" : "1.2",
				"desc" : "..."
			}, {
				"file" : "hiviya_07",
				"title" : "日比谷⇒銀座",
				"distance" : "0.4",
				"desc" : "..."
			}, {
				"file" : "hiviya_08",
				"title" : "銀座⇒東銀座",
				"distance" : "0.4",
				"desc" : "..."
			}, {
				"file" : "hiviya_09",
				"title" : "東銀座⇒築地",
				"distance" : "0.6",
				"desc" : "..."
			}, {
				"file" : "hiviya_10",
				"title" : "築地⇒八丁堀",
				"distance" : "1.0",
				"desc" : "..."
			}, {
				"file" : "hiviya_11",
				"title" : "八丁堀⇒茅場町",
				"distance" : "0.5",
				"desc" : "..."
			}, {
				"file" : "hiviya_12",
				"title" : "茅場町⇒人形町",
				"distance" : "0.9",
				"desc" : "..."
			}, {
				"file" : "hiviya_13",
				"title" : "人形町⇒小伝馬町",
				"distance" : "0.6",
				"desc" : "..."
			}, {
				"file" : "hiviya_14",
				"title" : "小伝馬町⇒秋葉原",
				"distance" : "0.9",
				"desc" : "..."
			}, {
				"file" : "hiviya_15",
				"title" : "秋葉原⇒仲御徒町",
				"distance" : "1.0",
				"desc" : "..."
			}, {
				"file" : "hiviya_16",
				"title" : "仲御徒町⇒上野",
				"distance" : "0.5",
				"desc" : "..."
			}, {
				"file" : "hiviya_17",
				"title" : "上野⇒入谷",
				"distance" : "1.2",
				"desc" : "..."
			}, {
				"file" : "hiviya_18",
				"title" : "入谷⇒三ノ輪",
				"distance" : "1.2",
				"desc" : "..."
			}, {
				"file" : "hiviya_19",
				"title" : "三ノ輪⇒南千住",
				"distance" : "0.8",
				"desc" : "..."
			} ]
		};

		// 各テーブル行作成
		var tableRow = [];
		for ( var i = 0; i < objLine.hiviya.length; i++) {
			// テーブルセクション情報設定
			tableRow[i] = app.ui.all.setTableRow(objLine.hiviya[i].title,
					objLine.hiviya[i].file + '.mp4');
			// セクションに行追加
			line.add(tableRow[i]);
		}
		// セクションをテーブルデータに挿入
		movies.push(line);

		// 最後にテーブルビュー作成！
		var tblView = Titanium.UI.createTableView({
			data : movies,
		});
		win.add(tblView);

		// テーブルビュークリック処理
		tblView.addEventListener('click', function(e) {
			// 動画再生画面作成（ストリーミング再生）
			var childWin = app.ui.all.createStreamingWindow(e.rowData.title,
					e.rowData.url);
			tab.open(childWin);
		});

		return tab;

	};

	// 動画再生画面作成ファンクション
	app.ui.all.createStreamingWindow = function(title, url) {

		// ウインドウ作成
		var childWin = Titanium.UI.createWindow({
			title : title,
			backButtonTitle : 'All List',
		});

		// 動画プレイヤー作成
		var videoPlayer = Titanium.Media.createVideoPlayer({
			autoplay : true, // 自動再生有効
			height : 'auto',
			width : 'auto',
			mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
			scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
		});

		// 対象のファイル（サーバー上）を動画プレイヤーに追加する
		videoPlayer.url = url;
		childWin.add(videoPlayer);

		// ダウンロードボタンを右上に設置
		var saveButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.SAVE
		});
		childWin.rightNavButton = saveButton;

		// ダウンロードボタンクリック時の処理
		saveButton.addEventListener('click', function(e) {

			// ネットワーク環境がない場合エラーを返す（ガード節）
			if (Titanium.Network.online == false) {
				var dialog = Ti.UI.createAlertDialog({
					message : 'パラレルワールドに接続することが出来ません。',
					ok : 'OK',
					title : 'NETWORK ERROR'
				}).show();
			}

			// プログレスバー作成
			var ind = Titanium.UI.createProgressBar({
				width : 180, // だいたいこれぐらいがいい感じだった（恣意的な値）
				min : 0,
				max : 100,
				value : 0,
				height : 60, // だいたいこれぐらいがいい感じだった（恣意的な値）
				color : '#888',
				message : 'ダウンロード開始',
				font : {
					fontSize : 14
				},
				style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
				top : 3
			// だいたいこれぐらいがいい感じだった（恣意的な値）
			});

			// HTTPオブジェクト作成（Ajaxと同じような記述）
			var xhr = Titanium.Network.createHTTPClient();

			// ロード完了時
			xhr.onload = function() {
				// プログレスバー削除
				childWin.remove(ind);
				// URL分解
				var arrUrl = url.split("/");
				// ファイル名（例：hiviya_01）
				var fileName = arrUrl[5];

				// rejectされた！！！！
				// ファイル保存
				// var f =
				// Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
				// fileName);

				// ファイル保存（キャッシュフォルダに保存しないとダメ！）
				var rootDir = Ti.Filesystem.applicationDataDirectory
						+ '../Library/Caches/';
				var f = Ti.Filesystem.getFile(rootDir, fileName);
				f.write(this.responseData);

				// ダイアログ表示
				var dialog = Ti.UI.createAlertDialog({
					message : 'ダウンロードが完了しました。',
					ok : 'OK',
					title : 'SUCCESS'
				}).show();
			};

			// エラー発生時
			xhr.onerror = function(error) {
				// プログレスバー削除
				childWin.remove(ind);
				// ダイアログ生成+表示
				var dialog = Ti.UI.createAlertDialog({
					message : 'ダウンロードに失敗しました。再度お試しください。',
					ok : 'OK',
					title : 'DOWNLOAD ERROR'
				}).show();
			};

			// プログレスバー進捗率初期化
			var val = 0;
			// 通信処理時
			xhr.ondatastream = function(e) {
				// プログレスバー表示
				childWin.add(ind);
				ind.show();
				
				// 進捗率設定
				val = Math.floor(e.progress * 100);

				// 進捗率表示
				var interval = setInterval(function() {

					// 100%の時（一瞬なのでほとんどみえないけど）
					if (e.progress == 1) {
						ind.value = 100;
						ind.message = 'ダウンロード完了';
						clearInterval(interval);
						ind.hide();
						return;
					}

					// 1秒単位で更新される
					ind.value = val;
					ind.message = 'ダウンロード中：' + val + ' %';

				}, 1000);

			};

			xhr.open('GET', videoPlayer.url);
			// リクエスト送信（引数としてJSON値を入れるとパラメータ化される）
			xhr.send();
		});

		return childWin;
	};

	// テーブル行作成ファンクション
	app.ui.all.setTableRow = function(title, file) {

		// テーブル行作成
		var tableRow = Ti.UI.createTableViewRow({
			title : title,
			hasChild : true, // 遷移先あり
			url : 'http://itosho.parallel.jp/app/tokyoedit/' + file,
			leftImage : '/img/dark/dark_play.png',
		});

		return tableRow;
	};

})();
