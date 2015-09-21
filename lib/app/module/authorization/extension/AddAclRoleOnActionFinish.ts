import Core = require("../../../../index");
import IValidationFilterData = require("./../../IValidationFilterData");
/**
 * Jest to dodatek do modułu autoryzacji. Pozwala ustawić że będziemy monitorować
 * akcje czy się zakończyły, jeśli konkretna akcja się zakończy to pozwoli to
 * odpalić callback do ustawienia roli lub ustawi wybraną rolę automatycznie.
 */
class AddAclRoleOnActionFinish extends Core.Extension {
	private _targetAction: Core.Action.BaseAction;
	private _roleList: string[];
	private _handler: (request: Core.Action.Request, response: Core.Action.Response) => { id: number; roleList:string[]};
	constructor(parent: Core.App.Module.Authorization) {
		super(parent);
	}
	protected getComponent(): Core.App.Module.Authorization {
		return <Core.App.Module.Authorization>super.getComponent();
	}
	public onConstructor() {
		var event = new Core.EventListener.Action.OnFinish(this.getComponent(), "checkActionFinish", true);
		/**
		 * event sprawdza zakończenie wszystkich akcji w aplikacji
		 */
		event.setHandler((request: Core.Action.Request, response: Core.Action.Response, done)=>{
			/**
			 * Działamy tylko gdy jest to event z wybranej konkretnej akcji
			 */
			if(request.action !== null && request.action === this._targetAction){
				/**
				 * działamy tylko jak mamy akcję zakończoną sukcesem
				 */
				if(response.getStatus() === 200){
					if (this._roleList || this._handler){
						Core.Util.Promise.resolve()
						.then(()=>{
							if (this._roleList && response.content && response.content[0] && response.content[0].id){
								return this.getComponent().addUserRoles(response.content[0].id, this._roleList);
							}
						})
						.then(()=>{
							if (this._handler){
								var roleUserIdObj = this._handler(request, response);
								return this.getComponent().addUserRoles(roleUserIdObj.id, roleUserIdObj.roleList);
							}
						})
						.then(() => {
							done();
						});
					}
				} else{
					done();
				}
			} else{
				done();
			}
		});
	}
	public setTargetAction(v: Core.Action.BaseAction){
		this._targetAction = v;
	}
	/**
	 * pozwala określić rolę jaka ma być ustawiana gdy okreśłona akcja zakończy się sukcesem
	 * rola przypisywana jest do id zasobu jeśli jest zdefiniowany content[0].id
	 */
	public setRole(roleList:string[]){
		this._roleList = roleList;
	}
	/**
	 * pozwala określić funkcję w której możemy określić dynamicznie jaką rolę przypisać do jakiego id
	 */
	public setHandler(v: (request: Core.Action.Request, response: Core.Action.Response) => { id: number; roleList: string[] }) {
		this._handler = v;
	}
}
export = AddAclRoleOnActionFinish;