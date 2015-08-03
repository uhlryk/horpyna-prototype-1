import Request = require("./../component/routeComponent/module/action/Request");
var Multer = require("multer");
/**
 * Obsługuje upload plików
 */
class FileUpload{
	private _directory: string;
	/**
	 * rozmiar pliku wyrażony w MB
	 */
	private _fileSize: number;
	/**
	 * callback na starcie pozwalający zmienić nazwę pliku
	 */
	private _filenameHandler: (req, file, cb: (error, filename: string) => void) => void;
	/**
	 * callback na starcie pozwalający zmienić katalog docelowy
	 */
	private _directoryHandler: (req, file, cb: (error, directory: string) => void) => void;
	/**
	 * callback na filtr, w którym validacja sprawdza czy plik jest ok
	 */
	private _fileFilterHandler: (req, file, cb: (error, result: boolean) => void) => void;
	constructor(){
		this._directory = "./tmp";
		this._fileSize = 12;
	}
	/**
	 * setter i getter na ścieżkę do katalogu w którym mają być pliki zapisywane.
	 * Jest to proste rozwiązanie ale nie dynamiczne (wszystkie pliki dla wszystkich requestów w jednym miejscu)
	 * jeśli chcielibyśmy by pliki były zapisywane w zależności od pola, i usera to trzeba by użyć directoryHandler
	 * i ustawić callback
	 */
	public get directory(): string {
		return this._directory;
	}
	public set directory(v:string){
		this._directory = v;
	}
	public get fileSize(): number {
		return this._fileSize;
	}
	public set fileSize(v: number) {
		this._fileSize = v;
	}
	/**
	 * Opcjonalny uchwyt na zmianę nazwy pliku na początku procesu
	 * w cb musimy ustawić cb(null, filename)
	 */
	public set filenameHandler(v: (request:Request, file, cb: (error, filename: string) => void) => void) {
		this._filenameHandler = (req, file, cb) => {
			var request: Request = Request.ExpressToRequest(req);
			v(request, file, cb);
		};
	}
	/**
	 * Opcjonlny uchwyt na zmianę katalogu docelowego
	 * w cb musimy ustawić cb(null, directory)
	 * Samodzielnie musimy utworzyć katalog
	 * Możemy zamiast uchwytu ustawić samo directory - wtedy w stringu podajemy nazwę katalogu
	 * jest to wygodniejsze ale nie dynamiczne (ustawiane dla akcji dla wszystkich requestów)
	 */
	public set directoryHandler(v: (request: Request, file, cb: (error, directory: string) => void) => void) {
		this._directoryHandler = (req, file, cb) => {
			var request: Request = Request.ExpressToRequest(req);
			v(request, file, cb);
		};
	}
	/**
	 * Uchwyt na filtr w którym określone jest czy akceptować pliki.
	 * Zmieniony został  expressRequest=>horpynaRequest i cb(err,bool) => done(bool)
	 * czyli w callbacku gdy wszystko poprawnie i można ściągać plik zwracamy done() lub done(true), a w przeciwnym razie done(false)
	 */
	public set fileFilterHandler(v: (request: Request, file, done: (cbResult?: boolean)=>void)=>void) {
		this._fileFilterHandler = (req, file, cb) => {
			var request: Request = Request.ExpressToRequest(req);
			v(request, file, (cbResult: boolean) => { cb(null, cbResult || cbResult===undefined ? true:false)});
		};
	}

	public create(fields?: Object[]): any {
		fields = fields || [];
		var storageConfig = {};
		if(this._directoryHandler){
			storageConfig['destination'] = this._directoryHandler;
		} else {
			storageConfig['destination'] = this.directory;
		}
		if (this._filenameHandler){
			storageConfig['filename'] = this._filenameHandler;
		}
		var storage = Multer.diskStorage(storageConfig);
		return Multer({
			storage: storage,
			fileFilter: this._fileFilterHandler,
			limits:{
				fileSize: 1024 * 1024 * this._fileSize,//maksymalny rozmiar każdego pliku
				files:100,//maksymalna liczba plików
			}
		}).fields(fields);
	}
}
export = FileUpload;