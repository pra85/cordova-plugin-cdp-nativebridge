/// <reference path="cdp.tools.d.ts" />
/// <reference path="cdp.plugin.nativebridge.d.ts" />
/// <reference path="require.d.ts" />
/// <reference path="cordova.d.ts" />
declare module CDP {
    module NativeBridge {
        import IPromise = CDP.Tools.IPromise;
        import Plugin = CDP.Plugin.NativeBridge;
        /**
         * @interface Feature
         * @brief 機能情報
         */
        interface Feature extends Plugin.Feature {
        }
        /**
         * @interface ConstructOptions
         * @brief 初期化に指定するオプション
         */
        interface ConstructOptions extends Plugin.ConstructOptions {
        }
        /**
         * @interface IResult
         * @brief NativeBridge の基底 Result 情報
         */
        interface IResult extends Plugin.IResult {
        }
        /**
         * @interface ExecOptions
         * @brief exec() に渡すオプション
         */
        interface ExecOptions extends Plugin.ExecOptions {
        }
        /**
         * @interface Promise
         * @brief NativeBridge が扱う Promise オブジェクトの定義
         */
        interface Promise extends IPromise<IResult> {
        }
    }
}
declare module CDP {
    module NativeBridge {
        /**
         * @class Utils
         * @brief CDP.NativeBridge が使用するユーティリティクラス
         */
        class Utils {
            private static s_pluginReady;
            /**
             * plugin の Result Code を CDP.NativeBridge にマップする
             *
             * @param errorCode {String} [in] Result Code 文字列を指定 ex): "SUCCESS_OK"
             */
            static defineResultCode(errorCode: string): void;
            /**
             * cordova が 使用可能になるまで待機
             */
            static waitForPluginReady(): JQueryPromise<void>;
            /**
             * Promise オブジェクトの作成
             * jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
             *
             * @param df {JQueryDeferred} [in] jQueryDeferred instance を指定
             * @return   {Promise} NativeBridge.Promise オブジェクト
             */
            static makePromise(df: JQueryDeferred<IResult>): Promise;
        }
    }
}
declare module CDP {
    module NativeBridge {
        var SUCCESS_OK: number;
        var SUCCESS_PROGRESS: number;
        var ERROR_FAIL: number;
        var ERROR_CANCEL: number;
        var ERROR_INVALID_ARG: number;
        var ERROR_NOT_IMPLEMENT: number;
        var ERROR_NOT_SUPPORT: number;
        var ERROR_INVALID_OPERATION: number;
        var ERROR_CLASS_NOT_FOUND: number;
        var ERROR_METHOD_NOT_FOUND: number;
        /**
         * @class Gate
         * @brief NativeBridge と通信するベースクラス
         *        このクラスから任意の Gate クラスを派生して実装可能
         */
        class Gate {
            private _bridge;
            /**
             * constructor
             *
             * @param feature {Feature}          [in] 初期化情報を指定
             * @param options {ConstructOptions} [in] オプションを指定
             */
            constructor(feature: Feature, options?: ConstructOptions);
            /**
             * タスクの実行
             * 指定した method 名に対応する Native Class の method を呼び出す。
             *
             * @param method  {String}       [in] Native Class のメソッド名を指定
             * @param args    {Object[]}     [in] 引数を配列で指定
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return {Promise} NativeBridge.Promise オブジェクト
             */
            exec(method: string, args?: any[], options?: ExecOptions): Promise;
            /**
             * すべてのタスクのキャンセル
             *
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return {Promise} NativeBridge.Promise オブジェクト
             */
            cancel(options?: ExecOptions): JQueryPromise<IResult>;
            /**
             * インスタンスの破棄
             * Native の参照を解除する。以降、exec は無効となる。
             *
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return {Promise} NativeBridge.Promise オブジェクト
             */
            dispose(options?: ExecOptions): JQueryPromise<IResult>;
            /**
             * Plugin.NativeBridge オブジェクトへのアクセス
             * 低レベル exec() を使用したい場合に利用可能
             *
             * @return {Plugin.NativeBridge}
             */
            protected bridge: Plugin.NativeBridge;
            private makeFatal();
        }
    }
}
declare module CDP {
    module NativeBridge {
    }
}
