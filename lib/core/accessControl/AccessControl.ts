var acl = require("acl");
var aclSeq = require('acl-sequelize');
import Core = require("../../index");
import Component = require("./../component/Component");
/**
 * Odpowiada za zarządzanie listą ról i ich uprawnień do zasobów
 * Jak również jacy użytkownicy mają uprawnienia do zasobów.
 * Zasobami są tylko akcje.
 * Uprawnienia akcji oznaczają czy np możemy aktualizować wszystkie wpisy na blogu czy tylko te których jesteśmy autorami
 * Czyli uprawnienia określają zakres
 */
class AccessControl extends Component {
	/**
	 * każda akcja jeśli ma przyznawaną jakąś rolę to dostaje również tą.
	 * Dzięki czemu łatwo będzie pobrać wszystkie akcje z rolami
	 */
	private ALL_RESOURCE_ROLE = "all_resource_role";

	public static STORAGE_DATABASE = "database";
	public static STORAGE_MEMORY = "memory";
	private _acl: any;
	private _type: string;
	constructor(parent: Core.Module, name: string, type: string) {
		super(<Component>parent, name);
		this._type = type;
	}
	protected onInit(): Core.Util.Promise<void> {
		return super.onInit()
		.then(()=>{
			var connection = this.componentManager.dbManager.getConnection();
			switch (this._type) {
				case AccessControl.STORAGE_DATABASE:
					this._acl = new acl(new aclSeq(connection.getDb(), { prefix: this.name+'_' }));
					break;
				default:
					this._acl = new acl(new acl.memoryBackend());
			}
		});
	}
	public allow(roleList: string[], actionList: Core.Action.BaseAction[]): Core.Util.Promise<void>{
		roleList.push(this.ALL_RESOURCE_ROLE);
		var componentIdList:string[] = [];
		for (var i = 0; i < actionList.length; i++){
			var action = actionList[i];
			componentIdList.push(action.id.toString());
		}
		return this._acl.allow(roleList, componentIdList, '*');
	}
	public isAllowed(userId: number, action: Core.Action.BaseAction): Core.Util.Promise<boolean> {
		return this._acl.isAllowed(userId, action.id.toString(), '*');
	}
	public isActionRestricted(action: Core.Action.BaseAction): Core.Util.Promise<boolean> {
		return this._acl.areAnyRolesAllowed(this.ALL_RESOURCE_ROLE, action.id.toString(), 'any');
	}
	public isRoleAllowedAction(role: string, action: Core.Action.BaseAction): Core.Util.Promise<boolean> {
		return this._acl.areAnyRolesAllowed(role, action.id.toString(), 'any');
	}
	public addUserRoles(userId:number, roleList:string[]): Core.Util.Promise<void> {
		return this._acl.addUserRoles(userId.toString(), roleList);
	}
}
export = AccessControl;