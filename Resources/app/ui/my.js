(function() {
	// アプリの名前空間を分割する
	app.ui.my = {};

	// My Tokyタブのファクトリメソッド
	app.ui.my.createMyTokyoTab = function() {

		// ウインドウ生成
		var win = Ti.UI.createWindow({
			title : 'My Tokyo Edit'
		});
		// 右上にマニュアルボタン設置
		var manualButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.INFO_LIGHT
		});
		win.rightNavButton = manualButton;
		// タブ作成
		var tab = Ti.UI.createTab({
			icon : '/img/dark/dark_download.png',
			title : 'My Tokyo',
			window : win
		});

		// マニュアルボタン押下時ダイアログ表示
		manualButton.addEventListener('click', function(e) {
			// ダイアログ生成+表示
			var dialog = Ti.UI.createAlertDialog({
				message : 'My Tokyoではダウンロード済の動画をオフラインで視聴できます。',
				ok : 'CLOSE',
				title : 'About My Tokyo'
			}).show();
		});

		// My Tokyoフォーカス時の処理
		win.addEventListener('focus', function(e) {
			// ダウンロードコンテンツや削除コンテンツを即反映させるため、表示するたびに常に動かす！

			// テーブルデータ初期化
			var movies = [];
			// テーブルセクション（当面は日比谷線だけ。。。）
			var line = Ti.UI.createTableViewSection({
				headerTitle : '東京メトロ日比谷線'
			});

			// iOS7から動かなくなった！？
			// コンテンツ設定ファイル取得
			// var fileContents = Ti.Filesystem.getFile(
			// Titanium.Filesystem.resourcesDirectory,
			// '/app/contents.json');
			// 文字列（JSON）へ変換 var jsonContents =
			// fileContents.read().toString();
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
			var tableFile = [];
			var tableRow = [];
			for ( var i = 0; i < objLine.hiviya.length; i++) {
				// リジェクトされたのでコメントアウト
				// 動画ファイル取得
				// tableFile[i] =
				// Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
				// objLine.hiviya[i].file + '.mp4');

				// リジェクト対応
				var rootDir = Ti.Filesystem.applicationDataDirectory
						+ '../Library/Caches/';
				tableFile[i] = Ti.Filesystem.getFile(rootDir,
						objLine.hiviya[i].file + '.mp4');

				// ダウンロード済確認
				if (tableFile[i].size > 1) {
					// ダウンロード済の場合テーブル行をセクションに追加
					tableRow[i] = app.ui.my.setTableRow(
							objLine.hiviya[i].title, objLine.hiviya[i].file
									+ '.mp4');
					line.add(tableRow[i]);
				}
			}

			// セクションをテーブルデータに挿入
			movies.push(line);
			// 最後にテーブルビュー作成！
			var tblView = Ti.UI.createTableView({
				data : movies,
			});
			win.add(tblView);

			// テーブルビュークリック処理
			tblView.addEventListener('click', function(e) {
				// 動画再生画面作成（ローカル再生）
				var childWin = app.ui.my.createLocalPlayWindow(e.rowData.title,
						e.rowData.url, tab);
				tab.open(childWin);
			});

			// スワイプ後の削除ボタンクリック処理
			tblView.addEventListener('delete', function(e) {
				// リジェクトされたのでコメントアウト
				// データの削除処理
				// var delFile =
				// Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
				// e.rowData.url);

				// リジェクト対応
				var rootDir = Ti.Filesystem.applicationDataDirectory
						+ '../Library/Caches/';
				// 動画ファイル削除
				var delFile = Ti.Filesystem.getFile(rootDir, e.rowData.url);
				delFile.deleteFile();

				var arrDelFile = e.rowData.url.split(".");

				// リジェクトされたのでコメントアウト
				// var thumDelFile =
				// Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
				// thumDelFileName);

				// リジェクト対応
				var thumDelFileName = 'thum_' + arrFile[0] + '.jpg';

				var thumDelFile = Ti.Filesystem.getFile(rootDir,
						thumDelFileName);
				thumDelFile.deleteFile();

			});

		});

		return tab;

	};

	// 動画再生画面作成ファンクション
	app.ui.my.createLocalPlayWindow = function(title, url, tab) {

		// ウインドウ作成
		var childWin = Titanium.UI.createWindow({
			title : title,
			backButtonTitle : 'My List',
		});

		// 動画プレイヤー作成
		var videoPlayer = Ti.Media.createVideoPlayer({
			autoplay : true, // 自動再生有効
			height : 'auto',
			width : 'auto',
			mediaControlStyle : Ti.Media.VIDEO_CONTROL_DEFAULT,
			scalingMode : Ti.Media.VIDEO_SCALING_ASPECT_FIT
		});
		// rejectされた！！！！
		// 対象のローカルファイルを動画プレイヤーに追加する
		// var file =
		// Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, url);

		// 対象のローカルファイルを動画プレイヤーに追加する
		var rootDir = Ti.Filesystem.applicationDataDirectory
				+ '../Library/Caches/';
		var file = Ti.Filesystem.getFile(rootDir, url);
		videoPlayer.url = file.nativePath;
		childWin.add(videoPlayer);

		// プチ情報ボタンを右上に設置
		var infoButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.BOOKMARKS
		});
		childWin.rightNavButton = infoButton;

		// プチ情報ボタンクリック時の処理
		infoButton.addEventListener('click', function(e) {

			// ウインドウ作成
			var infoWin = Ti.UI.createWindow({
				title : title,
				backButtonTitle : 'Movie',
			// backgroundColor : '#000'
			});
			// イメージビュー作成（地図画像表示）
			var arrUrl = url.split('.');
			var mapName = 'map_' + arrUrl[0] + '.jpg';
			var mapImage = Ti.UI.createImageView({
				// backgroundColor : '#000',
				image : '/img/map/' + mapName
			});
			infoWin.add(mapImage);

			tab.open(infoWin);
		});

		return childWin;
	};

	// テーブル行作成ファンクション
	app.ui.my.setTableRow = function(title, fileName) {

		// サムネイル取得
		var arrFile = fileName.split(".");
		var thumFileName = 'thum_' + arrFile[0] + '.jpg';

		// rejectされた！！！！
		// var thumFile =
		// Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
		// thumFileName);

		var rootDir = Ti.Filesystem.applicationDataDirectory
				+ '../Library/Caches/';
		var thumFile = Ti.Filesystem.getFile(rootDir, thumFileName);

		// サムネイルがない場合
		if (thumFile.size < 1) {
			// サムネイル作成（動画からサムネイルを作成出来るのはiOSのみ）
			var tmpFile = Ti.Filesystem.getFile(rootDir, fileName);
			var tmpVidPlayer = Ti.Media.createVideoPlayer({
				autoplay : false,
				url : tmpFile.nativePath
			});
			var thumbnail = tmpVidPlayer.thumbnailImageAtTime(60,
					Ti.Media.VIDEO_TIME_OPTION_EXACT);
			// これでプレイヤーは破棄出来るのかな？
			var tmpVidPlayer = null;
			thumbnail = thumbnail.imageAsResized(48, 36);

			var thumFile = Ti.Filesystem.getFile(rootDir, thumFileName);
			thumFile.write(thumbnail);
		}

		// テーブル行生成
		var tableRow = Ti.UI.createTableViewRow({
			title : title,
			hasChild : true, // 遷移先あり
			url : fileName,
			editable : true,
			leftImage : thumFile.nativePath,
		});

		return tableRow;
	};

})();
