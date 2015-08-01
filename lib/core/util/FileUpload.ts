var Multer = require("multer");

/**
 * Obsługuje upload plików
 */
class FileUpload{
	private _directory: string;
	private _filenameHandler: (req, file, cb: (error, name: string) => void) => void;
	constructor(){
		this._directory = "./tmp";
	}
	public get directory(): string {
		return this._directory;
	}
	public set directory(v:string){
		this._directory = v;
	}
	public set filenameHandler(v:(req, file, cb:(error, name:string)=>void)=>void){
		this._filenameHandler = v;
	}
	public create(fields?:Object[]): any {
		fields = fields || [];
		var storage = Multer.diskStorage({
			destination: this.directory,
		})
		if (this._filenameHandler){
			storage.filename = this._filenameHandler;
		}
		return Multer({ storage: storage }).fields(fields);
	}
}
export = FileUpload;