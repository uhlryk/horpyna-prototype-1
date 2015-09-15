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
	public static STORAGE_DATABASE = "database";
	public static STORAGE_MEMORY = "memory";
	private _acl: any;
	constructor(parent: Core.Module, name: string, type: string) {
		super(<Component>parent, name);
		var connection = this.componentManager.dbManager.getConnection();
		switch(type){
			case AccessControl.STORAGE_DATABASE:
				this._acl = new acl(new aclSeq(connection.getDb(), { prefix: name+'_' }));
				break;
			default:
				this._acl = new acl(new acl.memoryBackend());
		}
	}
	public allow(roleList: string[], actionList: Core.Action.BaseAction[]): Core.Util.Promise<void>{
		var componentIdList:string[] = [];
		for (var i = 0; i < actionList.length; i++){
			var action = actionList[i];
			componentIdList.push(action.id.toString());
		}
		return this._acl.allow(roleList, componentIdList, '*');
	}
	public isRoleAllowedResource(role: string, action: Core.Action.BaseAction): Core.Util.Promise<any> {
		return this._acl.areAnyRolesAllowed(role, action.id.toString(), 'any');
	}
}
export = AccessControl;