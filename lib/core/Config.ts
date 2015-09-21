class Config {
	/**
	 * Przechowuje konfiguracje dla różnych zmiennych środowiskowych
	 * środowisko default jest domyślnym i zawsze jest brane przy pobieraniu danych
	 * ale zawsze jest próba nadpisania danymi z konkretnego środowiska
	 */
	private _configData: Object;
	private _defaultEnv: string;
	/**
	 * W konstruktorze podajemy aktualny env dla tej instancji aplikacji
	 * czyli zmienną środowiskową. Możemy dla jednego serwera ustawić np deploy, production i test i tylko sterując tą
	 * zmienną możemy przełączać zmienne środowiskowe
	 */
	private _actEnv: string;
	constructor(env?: string){
		this._defaultEnv = "default";
		if (env) {
			this._actEnv = env;
		} else {
			this._actEnv = "production";
		}
		this._configData = new Object();
		this._configData[this._defaultEnv] = new Object();
		this._configData[this._actEnv] = new Object();
	}
	public setConfig(data: Object){
		this._configData = data;
		if (!this._configData[this._defaultEnv]){
			this._configData[this._defaultEnv] = new Object();
		}
		if (!this._configData[this._actEnv]) {
			this._configData[this._actEnv] = new Object();
		}
	}
	public setConfigEnv(env: string, data: Object){
		this._configData[env] = data;
	}
	public setConfigDefaultEnv(data:Object){
		this._configData[this._defaultEnv] = data;
	}
	public setConfigEnvKey(env: string, key:string, data: any) {
		if (this._configData[env] === undefined){
			this._configData[env] = new Object();
		}
		this._configData[env][key] = data;
	}
	public setConfigDefaultEnvKey(key:string, data:any){
		this._configData[this._defaultEnv][key] = data;
	}
	public getKey(key: string){
		var defaultValue = this._configData[this._defaultEnv][key];
		var actValue = this._configData[this._actEnv][key];
		if(actValue){
			return actValue;
		} else{
			return defaultValue;
		}
	}
	public isKey(key:string):boolean{
		var defaultValue = this._configData[this._defaultEnv][key];
		var actValue = this._configData[this._actEnv][key];
		if (defaultValue || actValue){
			return true;
		} else {
			return false;
		}
	}
}
export = Config;