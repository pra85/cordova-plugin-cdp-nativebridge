/// <reference path="jquery.d.ts" />
/// <reference path="jquery.mobile.d.ts" />
/// <reference path="cdp.framework.jqm.d.ts" />
/// <reference path="cdp.tools.d.ts" />
/// <reference path="cdp.ui.listview.d.ts" />
declare module CDP {
    module UI {
        /**
         * @class Toast
         * @brief Android SDK の Toast クラスのように自動消滅するメッセージ出力ユーティリティ
         *        入れ子の関係を実現するために module で実装
         */
        module Toast {
            var LENGTH_SHORT: number;
            var LENGTH_LONG: number;
            enum OffsetX {
                LEFT = 1,
                RIGHT = 2,
                CENTER = 4,
            }
            enum OffsetY {
                TOP = 16,
                BOTTOM = 32,
                CENTER = 64,
            }
            /**
             * @interface StyleBuilder
             * @brief     スタイル変更時に使用するインターフェイス
             *            css にスタイルを逃がす場合、独自の class を設定し、getStyle は null を返すこと。
             */
            interface StyleBuilder {
                getClass(): string;
                getStyle(): any;
                getOffsetPoint(): number;
                getOffsetX(): number;
                getOffsetY(): number;
            }
            /**
             * @class StyleBuilderDefault
             * @brief スタイル変更時に使用する既定の構造体オブジェクト
             */
            class StyleBuilderDefault implements StyleBuilder {
                getClass(): string;
                getStyle(): any;
                getOffsetPoint(): number;
                getOffsetX(): number;
                getOffsetY(): number;
            }
            /**
             * Toast 表示
             *
             * @param message  [in] メッセージ
             * @param duration [in] 表示時間を設定 (msec) default: LENGTH_SHORT
             * @param style    [in] スタイル変更する場合には派生クラスオブジェクトを指定
             */
            function show(message: string, duration?: number, style?: StyleBuilder): void;
        }
    }
}
declare module CDP {
    module UI {
        /**
         * @interface DialogOptions
         *            ダイアログオプションインターフェイス
         */
        interface DialogOptions {
            src?: string;
            title?: string;
            message?: string;
            idPositive?: string;
            idNegative?: string;
            transition?: string;
            event?: string;
            dismissible?: boolean;
            labelPositive?: string;
            labelNegative?: string;
        }
        /**
         * @class Dialog
         * @brief 汎用ダイアログクラス
         *        jQM の popup widget によって実装
         */
        class Dialog {
            private _template;
            private _settings;
            private _$dialog;
            private static s_activeDialog;
            private static s_oldBackKeyHandler;
            private static s_defaultOptions;
            /**
             * constructor
             *
             * @param id      {String}        [in] ダイアログ DOM ID を指定 ex) #dialog-hoge
             * @param options {DialogOptions} [in] オプション
             */
            constructor(id: string, options?: DialogOptions);
            /**
             * 表示
             * 表示をして始めて DOM が有効になる。
             *
             * @param options {DialogOptions} [in] オプション (src は無視される)
             * @return ダイアログの jQuery オブジェクト
             */
            show(options?: DialogOptions): JQuery;
            /**
             * 終了
             * 基本的には自動で閉じるが、
             * 表示中のダイアログをクライアント側から閉じるメソッド
             */
            close(): void;
            $el: JQuery;
            /**
             * Dialog の既定オプションを更新
             * すぺての Dialog が使用する共通設定
             *
             * @param options {DialogOptions} [in] ダイアログオプション
             */
            static setDefaultOptions(options: DialogOptions): void;
            private static register(dialog);
            /**
             * Dialog 共通設定の初期化
             */
            private static initCommonCondition();
            /**
             * H/W Back Button Handler
             */
            private static customBackKeyHandler(event?);
        }
    }
}
declare module CDP {
    module UI {
        import Framework = CDP.Framework;
        /**
         * @interface BasePageView
         * @brief     PageView<Backbone.Model> の alias
         */
        interface BasePageView extends PageView<Backbone.Model> {
        }
        /**
         * @interface PageViewConstructOptions
         * @brief Router への登録情報と Backbone.View への初期化情報を格納するインターフェイスクラス
         */
        interface PageViewConstructOptions<TModel extends Backbone.Model> extends Framework.PageConstructOptions, Backbone.ViewOptions<TModel> {
            basePage?: new (url: string, id: string, options?: Framework.PageConstructOptions) => Framework.Page;
        }
        /**
         * @interface PageContainerOptions
         * @brief PageContainer のオプション
         */
        interface PageContainerOptions<TModel extends Backbone.Model> extends Backbone.ViewOptions<TModel> {
            owner: BasePageView;
            $el?: JQuery;
        }
        /**
         * @class PageContainerView
         * @brief PageView と連携可能な コンテナビュークラス
         */
        class PageContainerView<TModel extends Backbone.Model> extends Backbone.View<TModel> {
            private _owner;
            /**
             * constructor
             */
            constructor(options: PageContainerOptions<TModel>);
            owner: BasePageView;
        }
        /**
         * @class PageView
         * @brief CDP.Framework.Page と Backbone.View の両方の機能を提供するページの基底クラス
         */
        class PageView<TModel extends Backbone.Model> extends Backbone.View<TModel> implements Framework.IPage, IStatusManager {
            protected _pageOptions: PageViewConstructOptions<TModel>;
            protected _basePage: Framework.Page;
            private _statusMgr;
            /**
             * constructor
             *
             * @param url     {String}                   [in] ページ URL
             * @param id      {String}                   [in] ページ ID
             * @param options {PageViewConstructOptions} [in] オプション
             */
            constructor(url: string, id: string, options?: PageViewConstructOptions<TModel>);
            /**
             * 状態変数の参照カウントのインクリメント
             *
             * @param status {String} [in] 状態識別子
             */
            statusAddRef(status: string): number;
            /**
             * 状態変数の参照カウントのデクリメント
             *
             * @param status {String} [in] 状態識別子
             */
            statusRelease(status: string): number;
            /**
             * 処理スコープ毎に状態変数を設定
             *
             * @param status   {String}   [in] 状態識別子
             * @param callback {Function} [in] 処理コールバック
             */
            statusScope(status: string, callback: () => void): void;
            /**
             * 指定した状態中であるか確認
             *
             * @param status {String}   [in] 状態識別子
             * @return {Boolean} true: 状態内 / false: 状態外
             */
            isStatusIn(status: string): boolean;
            active: boolean;
            url: string;
            id: string;
            $page: JQuery;
            $header: JQuery;
            $footer: JQuery;
            intent: Framework.Intent;
            /**
             * Orientation の変更を受信
             *
             * @param newOrientation {Orientation} [in] new orientation code.
             */
            onOrientationChanged(newOrientation: Framework.Orientation): void;
            /**
             * H/W Back Button ハンドラ
             *
             * @param  event {JQueryEventObject} [in] event object
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            onHardwareBackButton(event?: JQueryEventObject): boolean;
            /**
             * Router "before route change" ハンドラ
             * ページ遷移直前に非同期処理を行うことが可能
             *
             * @return {JQueryPromise} jQueryPromise オブジェクト
             */
            onBeforeRouteChange(): JQueryPromise<any>;
            /**
             * 汎用コマンドを受信
             *
             * @param  event {JQueryEventObject} [in] event object
             * @param  event {kind}              [in] command kind string
             */
            onCommand(event?: JQueryEventObject, kind?: string): void;
            /**
             * 最初の OnPageInit() のときにのみコールされる
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            onInitialize(event: JQueryEventObject): void;
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            onPageBeforeCreate(event: JQueryEventObject): void;
            /**
             * jQM event: "pagecreate" (旧:"pageinit") に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            onPageInit(event: JQueryEventObject): void;
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            onPageBeforeShow(event: JQueryEventObject, data?: Framework.ShowEventData): void;
            /**
             * jQM event: "pagecontainershow" (旧:"pageshow") に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            onPageShow(event: JQueryEventObject, data?: Framework.ShowEventData): void;
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            onPageBeforeHide(event: JQueryEventObject, data?: Framework.HideEventData): void;
            /**
             * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            onPageHide(event: JQueryEventObject, data?: Framework.HideEventData): void;
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            onPageRemove(event: JQueryEventObject): void;
        }
    }
}
declare module CDP {
    module UI {
        /**
         * @interface PageListViewConstructOptions
         * @brief PageListView への初期化情報を格納するインターフェイスクラス
         */
        interface PageListViewConstructOptions<TModel extends Backbone.Model> extends ListViewOptions, PageViewConstructOptions<TModel> {
            autoDestoryElement?: boolean;
        }
        /**
         * @class PageListView
         * @brief 仮想リストビュー機能を持つ PageView クラス
         */
        class PageListView<TModel extends Backbone.Model> extends PageView<TModel> implements IListView {
            private _scrollMgr;
            private _needRebuild;
            /**
             * constructor
             *
             * @param url     {String}                       [in] page template に使用する URL
             * @param id      {String}                       [in] page に振られた ID
             * @param options {PageListViewConstructOptions} [in] オプション
             */
            constructor(url: string, id: string, options?: PageListViewConstructOptions<TModel>);
            reserveRebuild(): void;
            onOrientationChanged(newOrientation: Framework.Orientation): void;
            onBeforeRouteChange(): JQueryPromise<any>;
            onPageBeforeShow(event: JQueryEventObject, data?: Framework.ShowEventData): void;
            onPageShow(event: JQueryEventObject, data?: Framework.ShowEventData): void;
            onPageRemove(event: JQueryEventObject): void;
            isInitialized(): boolean;
            addItem(height: number, initializer: new (options?: any) => BaseListItemView, info: any, insertTo?: number): void;
            _addLine(_line: any, insertTo?: number): void;
            removeItem(index: number, size?: number, delay?: number): void;
            getItemInfo(target: number): any;
            getItemInfo(target: JQueryEventObject): any;
            refresh(): void;
            update(): void;
            rebuild(): void;
            release(): void;
            backup(key: string): boolean;
            restore(key: string, rebuild?: boolean): boolean;
            hasBackup(key: string): boolean;
            clearBackup(key?: string): boolean;
            backupData: any;
            setScrollHandler(handler: (event: JQueryEventObject) => void, on: boolean): void;
            setScrollStopHandler(handler: (event: JQueryEventObject) => void, on: boolean): void;
            getScrollPos(): number;
            getScrollPosMax(): number;
            scrollTo(pos: number, animate?: boolean, time?: number): void;
            ensureVisible(index: number, options?: EnsureVisibleOptions): void;
            getScrollMapHeight(): number;
            updateScrollMapHeight(delta: number): void;
            updateProfiles(from: number): void;
            getScrollMapElement(): JQuery;
            findRecycleElements(): JQuery;
            getListViewOptions(): ListViewOptions;
            private getPageBaseHeight();
        }
    }
}
declare module CDP {
    module UI {
        /**
         * @class PageExpandableListView
         * @brief 開閉リストビュー機能を持つ PageView クラス
         */
        class PageExpandableListView<TModel extends Backbone.Model> extends PageListView<TModel> implements IExpandableListView {
            private _expandManager;
            /**
             * constructor
             *
             * @param url     {String}                       [in] page template に使用する URL
             * @param id      {String}                       [in] page に振られた ID
             * @param options {PageListViewConstructOptions} [in] オプション
             */
            constructor(url: string, id: string, options?: PageListViewConstructOptions<TModel>);
            newGroup(id?: string): GroupProfile;
            getGroup(id: string): GroupProfile;
            registerTopGroup(topGroup: GroupProfile): void;
            getTopGroups(): GroupProfile[];
            expandAll(): void;
            collapseAll(delay?: number): void;
            isExpanding(): boolean;
            isCollapsing(): boolean;
            isSwitching(): boolean;
            layoutKey: string;
            release(): void;
            backup(key: string): boolean;
            restore(key: string, rebuild?: boolean): boolean;
        }
    }
}